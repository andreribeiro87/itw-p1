
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
                console.log(data);
                hideLoading();
                for (let y = 0; y < data.Records.length; y++) {
                    self.GameYear.push(data.Records[y].Year)
                }
                console.log(self.GameYear(), 'GameYear');
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
                                    return {
                                        label: value.Name,
                                        value: value.Id
                                    }
                                });
                                results = $.ui.autocomplete.filter(nData, request.term);
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
        console.log(self.favData)

        console.log(self.favCompetitionsData(), 'pilinh')
        //----------END-FAVORITOS-------------//
        $('#pila').click(function () {
            var CountrySearched = $('#searchCountrie').val();
            // console.log(self.GameYear(), 'self.GameYear()')
            let alfa = []
            for (let i = 0; i < 53; i++) {
                alfa.push(self.activate(i))//o id é dos jogos
            }
            // console.log(self.activate(), 'self.activate(CountrySearched)')


            Chart.register(ChartjsPluginStacked100.default);

            new Chart(document.getElementById("Chart2"), {
                type: "bar",
                data: {
                    labels: self.GameYear(),
                    datasets: [
                        { label: "bad", data: [5, 25], backgroundColor: "rgba(244, 143, 177, 0.6)" },
                        { label: "better", data: [15, 10], backgroundColor: "rgba(255, 235, 59, 0.6)" },
                        { label: "good", data: [10, 8], backgroundColor: "rgba(100, 181, 246, 0.6)" },
                    ],
                },
                options: {
                    indexAxis: "y",
                    plugins: {
                        stacked100: { enable: true },
                    },
                },
            });

        })
    }
    //ChartJS//


    //endChartJS//

    ko.applyBindings(new vm());
    console.count('td')



    //-Linha-para-eliminar-a-cache-do-browser-//
    // localStorage.clear();
    //---------------------------------------//
    // console.log(self.favData, 'favData')
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})

//

