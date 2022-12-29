
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
        self.activate = function (id) {
            console.log('CALL: getGames...');
            var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=${id}&pagesize=25`;
            console.log(self.records(), 'records');
            if (window.location.search.includes("searchAthlete=")) {
                composedUri = `http://192.168.160.58/Olympics/api/Athletes/SearchByName?q=${(window.location.search).replace("?searchAthlete=", "")}`
                ajaxHelper(composedUri, 'GET').done(function (data) {
                    console.log(data);
                    hideLoading();
                    self.records(data);
                    for (var i = 0; i < data.length; i++) {
                        self.checkButtons(data[i].Id)
                    }
                });
            }
            else {
                // var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=5422&pagesize=25`;
                ajaxHelper(composedUri, 'GET').done(function (data) {
                    console.log(data);
                    hideLoading();
                    (self.records).push(...data.Records);
                    self.currentPage(data.CurrentPage);
                    self.photo(data.Photo);
                    self.hasNext(data.HasNext);
                    self.hasPrevious(data.HasPrevious);
                    // self.pagesize(data.PageSize)
                    self.totalPages(data.TotalPages);
                    self.totalRecords(data.TotalRecords);
                    for (var i = 0; i < data.Records.length; i++) {
                        self.checkButtons(data.Records[i].Id)
                    }


                    //self.SetFavourites();
                });
                console.log(self.records())
            }
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
        $('#searchAthlete').autocomplete({
            // source: self.availableTags(),
            max: 10,
            minLength: 4,
            source:
                function (request, response) {
                    $.ajax({
                        type: "GET",
                        url: `http://192.168.160.58/Olympics/api/Athletes/SearchByName?`,
                        data: {
                            q: $('#searchAthlete').val()
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
        self.activate(1);


        console.log("VM initialized!");
        //------SCROLL-INFINITE-----------------//
        $(document).scroll(function () {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            // console.log('scrollTop', scrollTop, 'scrollHeight', scrollHeight, 'clientHeight', clientHeight)
            // console.log('scrollHeight', scrollHeight)
            // console.log('clientHeight', clientHeight)


            if (scrollTop + clientHeight >= scrollHeight) {
                var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=${self.currentPage()}&pagesize=25`;
                console.log(self.totalPages(), 'totalPages')
                console.log(self.currentPage(), 'currentPage')

                if (self.totalPages() === self.currentPage()) {
                    console.log('end')
                    return;
                }
                console.log('self.currentPage()=', self.currentPage())
                setTimeout(async () => {
                    showLoading()
                    self.activate(self.currentPage() + 1)

                });

            }
        }),
        //-----Scroll Infinite 10000};
        {
            passive: true
        }
        //-----END-SCROLL-INFINITE-----------------//

        $('')

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

