$(document).ready(function () {

    // ViewModel KnockOut
    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        // self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/games');
        //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
        self.displayName = 'Olympic Games editions List';
        self.error = ko.observable('');
        self.passingMessage = ko.observable('');
        self.records = ko.observableArray([]);
        self.currentPage = ko.observable(1);
        // self.pagesize = ko.observable(5);
        self.totalRecords = ko.observable();
        self.hasPrevious = ko.observable(false);
        self.hasNext = ko.observable(false);
        self.previousPage = ko.computed(function () {
            return self.currentPage() * 1 - 1;
        }, self);
        // self.nextPage = ko.computed(function () {
        //     return self.currentPage() * 1 + 1;
        // }, self);
        // self.fromRecord = ko.computed(function () {
        //     return self.previousPage() * self.pagesize() + 1;
        // }, self);
        // self.toRecord = ko.computed(function () {
        //     return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
        // }, self);
        self.totalPages = ko.observable(0);
        // self.pageArray = function () {
        //     var list = [];
        //     var size = Math.min(self.totalPages(), 9);
        //     var step;
        //     if (size < 9 || self.currentPage() === 1)
        //         step = 0;
        //     else if (self.currentPage() >= self.totalPages() - 4)
        //         step = self.totalPages() - 9;
        //     else
        //         step = Math.max(self.currentPage() - 5, 0);

        //     for (var i = 1; i <= size; i++)
        //         list.push(i + step);
        //     return list;
        // };

        //--- Page Events
        self.activate = function (id) {
            console.log('CALL: getGames...');
            var composedUri = `http://192.168.160.58/Olympics/api/Games?page=${id}&pagesize=30`
            ajaxHelper(composedUri, 'GET').done(function (data) {
                console.log(data);
                hideLoading();
                (self.records).push(...data.Records);
                self.currentPage(data.CurrentPage);
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

        //--- start ....
        showLoading();
        self.activate(1);

        $(document).scroll(function () {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            // console.log('scrollTop', scrollTop)
            // console.log('scrollHeight', scrollHeight)
            // console.log('clientHeight', clientHeight)


            if (scrollTop + clientHeight >= scrollHeight) {
                var composedUri = `http://192.168.160.58/Olympics/api/Games?page=${self.currentPage()}&pagesize=25`;
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

                }, 1);
                self.currentPage() + 1;

            }
        }),
        //-----Scroll Infinite 10000};
        {
            passive: true
        }
        console.log("VM initialized!");
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

    console.log("ready!");
    ko.applyBindings(new vm());
    // localStorage.clear();

});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})