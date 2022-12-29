
////////////////////////////
// ViewModel KnockOut

// var b = 5420;

var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.displayName = 'Olympic Games editions List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.availableTags = ko.observableArray([]);//!!!!
    self.currentPage = ko.observable(1);
    // self.pagesize = ko.observable(100);
    self.totalRecords = ko.observable();
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.photo = ko.observable();


    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);

    self.totalPages = ko.observable(0);


    //--- Page Events
    // self.activate = function (id) {
    //     console.log('CALL: getGames...');

    //     // var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=${id}&pagesize=25`;
    //     // var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=5422&pagesize=25`;
    //     ajaxHelper(composedUri, 'GET').done(function (data) {
    //         console.log(data);
    //         hideLoading();
    //         (self.records).push(...data.Records);
    //         // self.pagesize(data.PageSize)
    //         for (var i = 0; i < data.Records.length; i++) {
    //             self.checkButtons(data.Records[i].Id)
    //         }


    //         //self.SetFavourites();
    //     });
    // };

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



    //---START-SHOW-FIRST-PAGE---//
    // showLoading();
    // self.activate(1);




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
    //function to get all data//
    // self.getAllDataUsingId = function (array) {
    //     var tempData = [];
    //     for (element in array) {
    //         console.log(array[element], 'arrelement');
    //         console.log(element.substring(3), 'element');
    //         for (id in array[element]) {
    //             ajaxHelper(`http://192.168.160.58/Olympics/api/${element.substring(3)}/${array[element][id]}`, 'GET').done(function (data) {
    //                 console.log(data, 'data');
    //                 tempData.push(data);
    //                 console.log(tempData, 'tempdata');
    //             });
    //         }
    //     }
    // }
    // self.getAllDataUsingId = function (array, nameapi) {
    //     let tempData = [];
    //     console.log(nameapi, 'name')
    //     debugger

    //     for (element in array) {
    //         console.log(array[element], 'arrelement');//sao os id//
    //         console.log(element, 'element');//são os indices//
    //         ajaxHelper(`http://192.168.160.58/Olympics/api/${nameapi}/${array[element]}`, 'GET').done(function (data) {
    //             console.log(data, 'data');

    //             tempData.push(data);
    //             // console.log(tempData, 'tempdata');
    //         });
    //     }
    //     return tempData;
    // }

    self.getAllDataUsingId = function (array, nameapi) {
        let tempData = [];
        console.log(nameapi, 'name')
        // debugger

        for (element in array) {
            console.log(array[element], 'arrelement');//sao os id//
            console.log(element, 'element');//são os indices//
            $.ajax({
                type: 'GET',
                url: `http://192.168.160.58/Olympics/api/${nameapi}/${array[element]}`,
                async: false,
                success: function (data) {
                    console.log(data, 'data');
                    tempData.push(data);
                }
            })
        }
        return tempData;
    }







    self.updateLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
    }

    self.checkButtons = function (id) {
        // debugger
        for (let k in self.favData) {
            console.log((self.favData[k].includes(String(id))), 'pilo')
            if (self.favData[k].includes(String(id))) {
                $('#' + k + '-btn' + id).addClass("active")
            }
        }
    }

    self.updatefavData = function (id, name) {
        // debugger
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
        self.favAthletesData(self.getAllDataUsingId(self.favData.favAthletes, 'Athletes'))
        self.favCompetitionsData(self.getAllDataUsingId(self.favData.favCompetitions, 'Competitions'))
        self.favModalitiesData(self.getAllDataUsingId(self.favData.favModalities, 'Modalities'))
        self.favCountriesData(self.getAllDataUsingId(self.favData.favCountries, 'Countries'))
        self.favGamesData(self.getAllDataUsingId(self.favData.favGames, 'Games'))
        // self.favData(self.getAllDataUsingId(self.favData))

    }

    self.start = function () {
        for (let k in self.favData) {
            console.log(k, 'k')
            if (localStorage.getItem(k) != null) {
                self.favData[k] = JSON.parse(localStorage.getItem(k))
            } else {
                self.favData[k] = []
            }
        }



        self.favAthletesData(self.getAllDataUsingId(self.favData.favAthletes, 'Athletes'));
        self.favCompetitionsData(self.getAllDataUsingId(self.favData.favCompetitions, 'Competitions'));
        self.favModalitiesData(self.getAllDataUsingId(self.favData.favModalities, 'Modalities'));
        self.favCountriesData(self.getAllDataUsingId(self.favData.favCountries, 'Countries'));
        self.favGamesData(self.getAllDataUsingId(self.favData.favGames, 'Games'));
        // setTimeout(function () {self.favData(self.getAllDataUsingId(self.favData));
    }
    // self.favModalitiesData(self.getAllDataUsingId(self.favData.favModalities, 'Modalities'))
    // self.favCountriesData(self.getAllDataUsingId(self.favData.favCountries, 'Countries'))
    // self.favGamesData(self.getAllDataUsingId(self.favData.favGames, 'Games'))
    // // self.getAllDataUsingId(self.favData)



    self.start()
    $('#pills-home-tab').click(function () {
        for (let j in self.favData) {
            // debugger
            console.log(self.favData[j], j)
            for (var i = 0; i < self.favData[j].length; i++) {
                console.log(self.favData[j][i], 'i')
                self.checkButtons(self.favData[j][i])
            }
        }
    })


    // console.log(self.favData, 'init')
    // console.log(self.favCountriesData(), 'countries')
    // console.log(self.favAthletesData(), 'athletes')




    //----------END-FAVORITOS-------------//

};
$(document).ready(function () {

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

