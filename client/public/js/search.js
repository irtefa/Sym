$(document).ready(function(e) {
    $('.box').on('typeahead:selected', function(evt, item) {
          var query = item.value;
          console.log(query);
    });

    $(document).on('click', '.search', function (e) {
        var query = [$('#search-form-1').val(), $('#search-form-2').val(), $('#search-form-3').val()];

        $('.results').empty();

        console.log(query);

        $.ajax({
            url: '/search',
            type: 'POST',
            data: {'query': query},
            success: function(data) {
                parsed_data = JSON.stringify(eval("(" + data + ")"));
                var recvData = JSON.parse(parsed_data);
                var hitsArray = recvData['hits']['hits'];
                _.each(hitsArray, function(obj) {
                    console.log(obj);
                    $('.results').append(constructDiv(obj));
                });
            }
        });
    });
});

function constructDiv(obj) {
    return '<pre><div class="question">'+obj['_source']['disease']+'</div></pre>';
}