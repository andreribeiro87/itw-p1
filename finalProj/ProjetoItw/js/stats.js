
////////////////////////////
// ViewModel KnockOut
$(document).ready(function () {
    // var b = 5420;

    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        self.displayName = 'Olympic Games editions List';
        self.error = ko.observable('');
        self.passingMessage = ko.observable('');
        self.countryId = ko.observableArray([]);
        self.availableTags = ko.observableArray([]);//!!!!
        // self.pagesize = ko.observable(100);
        self.countryName = ko.observable('');
        self.GameYear = ko.observableArray([]);

        self.Medals = ko.observableArray([]);


        //--- Page Events
        self.activate = function (id) {
            console.log('CALL: getGames...');
            console.log(id, 'id');
            var composedUri = `http://192.168.160.58/Olympics/api/Statistics/Medals_Country?id=${id}`;

            // var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=5422&pagesize=25`;
            ajaxHelper(composedUri, 'GET').done(function (data) {
                hideLoading();
                for (let i = 0; i < data.length; i++) {
                    self.countryId(data[i].CountryId);
                    self.countryName(data[i].CountryName)
                    self.Medals(data[i].Medals);
                }
                console.log(self.Medals(), 'Medals');
                console.log('correu bem')



                //self.SetFavourites();
            });

        };
        self.getArray = function () {
            var composedUri = `http://192.168.160.58/Olympics/api/Games?page=1&pagesize=200`;
            ajaxHelper(composedUri, 'GET').done(function (data) {
                // console.log(data);
                hideLoading();
                for (let y = 0; y < data.Records.length; y++) {
                    self.GameYear.push(data.Records[y].Year)
                }
                // console.log(self.GameYear(), 'GameYear');
            })
            return self.GameYear();
        };


        //--- Internal functions
        function ajaxHelper(uri, method, data) {
            self.error(''); // Clear error message
            return $.ajax({
                type: method,
                url: uri,
                dataType: 'json',
                contentType: 'application/json',
                data: data ? JSON.stringify(data) : null,
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("AJAX Call[" + uri + "] Fail...");
                    hideLoading();
                    self.error(errorThrown);
                }
            });
        }

        function sleep(milliseconds) {
            const start = Date.now();
            while (Date.now() - start < milliseconds);
        }

        function showLoading() {
            $("#myModal").modal('show', {
                backdrop: 'static',
                keyboard: false
            });
        }
        function hideLoading() {
            $('#myModal').on('shown.bs.modal', function (e) {
                $("#myModal").modal('hide');
            })
        }

        function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
            console.log("sPageURL=", sPageURL);
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        };
        function once(fn) {
            var executed = false;
            return function () {
                if (!executed) {
                    executed = true;
                    // do something
                    fn(x);
                }
            };
        }


        //-----SearchingTime------//
        self.search = function (q) {
            if (q.length < 4) return;
            else {
                var composedUri = `http://192.168.160.58/Olympics/api/Athletes/SearchByName?q=${q}`;
                // var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=5422&pagesize=25`;
                ajaxHelper(composedUri, 'GET').done(function (data) {
                    console.log(data, 'data?');
                    hideLoading();
                    self.availableTags(data);
                    //self.SetFavourites();
                });
            }
        };
        //
        $('#searchAll').autocomplete({
            // source: self.availableTags(),
            max: 50,
            minLength: 3,
            source:
                function (request, response) {
                    $.ajax({
                        type: "GET",
                        url: `http://192.168.160.58/Olympics/api/Utils/Search?`,
                        data: {
                            q: $('#searchAll').val()
                        },
                        success: function (data) {

                            if (!data.length) {
                                var result = [{
                                    label: 'No matches found',
                                    value: response.term
                                }];
                                response(result);
                            } else {

                                var nData = $.map(data, function (value, key) {
                                    return {
                                        label: value.Name,
                                        value: value.Name
                                    }
                                });
                                results = $.ui.autocomplete.filter(nData, request.term);
                                response(results.slice(0, 20));
                            }
                        },
                        error: function () {
                            alert("error!");
                        }
                    })
                },

        });
        $('#searchCountrie').autocomplete({
            // source: self.availableTags(),
            max: 10,
            minLength: 3,
            source:
                function (request, response) {
                    $.ajax({
                        type: "GET",
                        url: `http://192.168.160.58/Olympics/api/Countries/SearchByName?`,
                        data: {
                            q: $('#searchCountrie').val()
                        },
                        success: function (data) {

                            if (!data.length) {
                                var result = [{
                                    label: 'No matches found',
                                    value: response.term
                                }];
                                response(result);
                            } else {

                                var nData = $.map(data, function (value, key) {

                                    return alfinha = [{
                                        label: value.Name,
                                        value: value.Name,
                                    }]
                                });
                                $('#searchCountrie').append(nData.searchCount)
                                results = $.ui.autocomplete.filter(nData, request.term);
                                console.log(alfinha, 'results');
                                console.log($('#searchCountrie').append(nData.searchCount), 'nData');
                                response(results);
                            }
                        },
                        error: function () {
                            alert("error!");
                        }
                    })
                },
        });



        //-----END-SEARCH------//

        //---START-SHOW-FIRST-PAGE---//
        showLoading();
        self.getArray()
        console.log(self.getArray(), 'self.getArray()');


        console.log("VM initialized!");



        //----------FAVORITOS-------------// 
        console.log("ready!");
        self.favData = {
            "favAthletes": [],
            "favCompetitions": [],
            "favModalities": [],
            "favCountries": [],
            "favGames": []
        };
        self.favAthletesData = ko.observableArray([]);
        self.favCompetitionsData = ko.observableArray([]);
        self.favModalitiesData = ko.observableArray([]);
        self.favCountriesData = ko.observableArray([]);
        self.favGamesData = ko.observableArray([]);




        self.updateLocalStorage = (key, data) => {
            localStorage.setItem(key, JSON.stringify(data))
        }

        self.checkButtons = function (id) {
            for (let k in self.favData) {
                if (self.favData[k].includes(String(id))) {
                    $('#' + k + '-btn' + id).addClass("active")
                }
            }
        }

        self.updatefavData = function (id, name) {
            if (!$('#' + name + '-btn' + id).hasClass("active")) {
                //Adicionar à lista de favoritos
                if (!self.favData[name].includes(id))
                    self.favData[name].push(String(id))

                self.updateLocalStorage(name, self.favData[name])
                $('#' + name + '-btn' + id).addClass("active")
            } else {
                //Remover do favoritos
                self.favData[name].splice(self.favData[name].indexOf(id), 1)
                self.updateLocalStorage(name, self.favData[name])

                $('#' + name + '-btn' + id).removeClass("active")
            }
            console.log(self.favData)
        }

        self.init = function () {
            for (let k in self.favData) {
                console.log(k, 'k')
                if (localStorage.getItem(k) != null) {
                    self.favData[k] = JSON.parse(localStorage.getItem(k))
                } else {
                    self.favData[k] = []
                }
            }
            self.favAthletesData(self.favData.favAthletes)
            self.favCompetitionsData(self.favData.favCompetitions)
            self.favModalitiesData(self.favData.favModalities)
            self.favCountriesData(self.favData.favCountries)
            self.favGamesData(self.favData.favGames)




        }

        self.init()
        self.GameName = ko.observableArray()
        self.GoldMedal = ko.observableArray()
        self.SilverMedal = ko.observableArray()
        self.BronzeMedal = ko.observableArray()
        var zeta = []

        self.getMedalData = function (id) {
            ajaxHelper(`http://192.168.160.58/Olympics/api/Statistics/Medals_Games?id=${id}`, 'GET').done(function (data) {

                for (let i = 0; i < data.length; i++) {
                    self.GoldMedal.push(data[i].Medals[0])
                    self.SilverMedal.push(data[i].Medals[1])
                    self.BronzeMedal.push(data[i].Medals[3])
                    if (data[i].GameName.includes('Summer')) {

                        (self.GameName).push(parseInt(data[i].GameName.replace('Summer', '')))
                        zeta.push(parseInt(data[i].GameName.replace('Summer', '')))
                    }
                    else {

                        (self.GameName).push(parseInt(data[i].GameName.replace('Winter', '')))
                        zeta.push(parseInt(data[i].GameName.replace('Winter', '')))
                    }



                }

            })
            return zeta



            // return 
        }
        console.log(zeta, 'zetinha')
        /*
        [
        {
        "GameId": 48,
        "GameName": "2008 Summer",
        "Medals": [
            {
                "MedalId": 1,
                "MedalName": "Gold",
                "Counter": 1
            },
            {
                "MedalId": 2,
                "MedalName": "Silver",
                "Counter": 1
            },
            {
                "MedalId": 3,
                "MedalName": "Bronze",
                "Counter": 0
            }
        ]
        }
        ]
        */


        const tentativa1 = []

        //----------END-FAVORITOS-------------//


    }
    //ChartJS//


    //endChartJS//

    ko.applyBindings(new vm());

    var tentativa1 = []

    function getEverything(id) {

    }
    console.count('td')
    var counter = 0

    $('#addChart').click(function () {
        var GameName = []
        var GoldMedal = []
        var SilverMedal = []
        var BronzeMedal = []
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: `http://192.168.160.58/Olympics/api/Countries/SearchByName?q=` + $('#searchCountrie').val(),
            success: function (data) {
                var countryId = data[0].Id
                console.log(countryId, 'countryId')


                $.ajax({

                    type: 'GET',
                    dataType: 'json',
                    url: `http://192.168.160.58/Olympics/api/Statistics/Medals_Games?id=${countryId}`,
                    success: function (data) {
                        console.log(alfinha, 'aflinha')
                        zeta = alfinha;

                        for (let i = 0; i < data.length; i++) {
                            if (data[i].GameName.includes('Summer')) {
                                GameName.push(parseInt(data[i].GameName.replace('Summer', '')))
                            }
                            else {
                                GameName.push(parseInt(data[i].GameName.replace('Winter', '')))
                            }

                            GoldMedal.push((data[i].Medals[0].Counter))
                            SilverMedal.push((data[i].Medals[1].Counter))
                            BronzeMedal.push((data[i].Medals[2].Counter))
                        }

                        function doNewChart() {

                            Chart.register(ChartjsPluginStacked100.default);

                            myChart = new Chart(document.getElementById("Chart2"), {
                                type: "bar",
                                data: {
                                    labels: GameName,
                                    datasets: [
                                        { label: "gold", data: GoldMedal, backgroundColor: "rgba(244, 143, 177, 0.6)" },
                                        { label: "silver", data: SilverMedal, backgroundColor: "rgba(255, 235, 59, 0.6)" },
                                        { label: "bronze", data: BronzeMedal, backgroundColor: "rgba(100, 181, 246, 0.6)" },
                                    ],
                                },
                                options: {
                                    indexAxis: "y",
                                    plugins: {
                                        stacked100: { enable: true },
                                    },
                                },
                            })

                        }

                        $.ajax({
                            type: 'GET',
                            dataType: 'json',
                            url: `http://192.168.160.58/Olympics/api/Countries/${countryId}`,
                            success: function (data) {
                                $('#destroyChart').click(function () {
                                    myChart.destroy()
                                    myChart1.destroy()
                                })
                                var CountryName = data.Name;


                                //Chart relative to the percentage of medals by game//
                                Chart.register(ChartjsPluginStacked100.default);
                                var myChart = new Chart(document.getElementById("Chart2"), {
                                    type: "bar",
                                    data: {
                                        labels: GameName,
                                        datasets: [
                                            { label: "gold", data: GoldMedal, backgroundColor: "#ffe140" },
                                            { label: "silver", data: SilverMedal, backgroundColor: "#9a9a9a" },
                                            { label: "bronze", data: BronzeMedal, backgroundColor: "#e9c7a5" },
                                        ],
                                    },
                                    options: {
                                        indexAxis: "y",
                                        plugins: {
                                            stacked100: { enable: true },
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Medals Relative ' + CountryName,
                                            }
                                        },



                                    },
                                });
                                //chart relative to the real count of medals//
                                var myChart1 = new Chart(document.getElementById("Chart3"), {
                                    type: "bar",
                                    data: {
                                        labels: GameName,
                                        datasets: [
                                            { label: "gold", data: GoldMedal, backgroundColor: "#ffe140" },
                                            { label: "silver", data: SilverMedal, backgroundColor: "#9a9a9a" },
                                            { label: "bronze", data: BronzeMedal, backgroundColor: "#e9c7a5" },
                                        ],
                                    },
                                    options: {
                                        indexAxis: "y",
                                        scales: {

                                            x: {
                                                stacked: true
                                            },
                                            y: {
                                                stacked: true,
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Number of Medals ' + CountryName,
                                            }
                                        }


                                    },

                                });
                            }

                        })
                    }

                })
                counter++
            },

        })

    })




    //-Linha-para-eliminar-a-cache-do-browser-//
    // localStorage.clear();
    //---------------------------------------//
    // console.log(self.favData, 'favData')
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})


