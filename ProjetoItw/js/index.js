
////////////////////////////
// ViewModel KnockOut
$(document).ready(function () {
    // var b = 5420;

    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;

        //--- Page Events

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

        //-----END-SEARCH------//

        //---START-SHOW-FIRST-PAGE---//




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




        }

        self.init()
        //----------END-FAVORITOS-------------//

    };


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

