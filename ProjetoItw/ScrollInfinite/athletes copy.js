var page1 = 1


var container1 = document.getElementById('pixa')

const records = ko.observableArray([])
var totalPages = ko.observable()




$(document).ready(function () {




    //-----Scroll Infinite
    $(document).scroll(function () {

        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        console.log('scrollTop', scrollTop)
        console.log('scrollHeight', scrollHeight)
        console.log('clientHeight', clientHeight)
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            page1++
            setTimeout(async () => { getinfo1() }, 1000)
        }
    }),
    //-----Scroll Infinite 10000};
    {
        passive: true
    }
    getinfo1()


    ko.applyBindings();

});







//----Function to get data from API and add to the table
function getinfo1() {

    $.ajax({
        type: "GET",
        url: "http://192.168.160.58/Olympics/api/Athletes?page=" + page1 + "&pagesize=30",
        success: function (data) {
            records.push(...data.Records)

            // records(data.Records)
            totalPages(data.TotalPages)

        }
    });
}



