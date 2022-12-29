// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Games/FullDetails?id=');
    self.displayName = 'Olympic Games edition Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.CountryName = ko.observable('');
    self.Year = ko.observable('');
    self.Photo = ko.observable('');
    self.Season = ko.observable('');
    self.City = ko.observable('');
    self.Logo = ko.observable('');
    self.Athletes = ko.observable('');
    self.Games = ko.observableArray([]);
    self.Modalities = ko.observableArray([]);
    self.Competitions = ko.observableArray([]);
    self.Medals = ko.observableArray([]);
    self.Url = ko.observable('');

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getGame...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.CountryName(data.CountryName);
            self.Year(data.Year);
            self.Photo(data.Photo);
            self.Season(data.Season);
            self.City(data.City);
            self.Logo(data.Logo);
            self.Athletes(data.Athletes);
            self.Games(data.Games);//ARRAY//
            self.Modalities(data.Modalities);//ARRAY//
            self.Competitions(data.Competitions)//ARRAY//
            self.Medals(data.Medals)//ARRAY//

            // let alfa = []
            // for (let i = 0; i < data.Medals[i].Counter; i++) {
            //     for (let j = 0; j < data.Medals[i].Counter; j++) {
            //         alfa.push(data.Medals)
            //     }
            // }
            // console.log(alfa, 'ALFA');
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

    function showLoading() {
        $('#myModal').modal('show', {
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

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
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




};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});
$(document).ready(function () {

    $(".showModal").on('load', function () {
        var url = $(this).find("img").attr("src");
        console.log(url, 'URL');
        $("#ModalI img").attr("src", url);
        $("#ModalImages").modal("show");
    });
});



$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});