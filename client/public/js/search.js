window.chosen = [];

$(document).ready(function(e) {
    $('.box').on('typeahead:selected', function(evt, item) {
        $('.guide').html('Keep adding more symptoms to narrow down the diagnosis');
        var query = item.value;
        chosen.push(query);
        $('.symptoms-added').append('<div class="added-symptom" data-toggle="tooltip" data-placement="left" title="Tooltip on left">'+query+'</div>');
        // <button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</button>
        $('.search-results').empty();   
        $('.search-results').append('<table class="table"><tbody></tbody></table>');    
        $.ajax({
            url: '/search',
            type: 'POST',
            data: {'query': chosen},
            success: function(data) {
                console.log(data);
                var parsed_data = JSON.stringify(eval("(" + data + ")"));
                var recvData = JSON.parse(parsed_data);
                var hitsArray = recvData['hits']['hits'];
                _.each(hitsArray, function(obj) {
                    var likelihood = computeLikelihood(obj['_source']);
                    if (likelihood > 0) {
                        $('tbody').append(constructDiv(obj, likelihood));
                    }
                });
            }
        });
        $('.box').val('');
    });

    $(document).on('click', '.added-symptom', function(e, v) {
        var removeThis = $(this).html();
        var newChosen = [];
        _.each(chosen, function(obj) {
            if (removeThis === obj);
            else {
                newChosen.push(obj);
            }
        });
        chosen = newChosen;
        $(this).remove();
        $('.search-results').empty();       
        $('.search-results').append('<table class="table"><tbody></tbody></table>');        
        $.ajax({
            url: '/search',
            type: 'POST',
            data: {'query': chosen},
            success: function(data) {
                var parsed_data = JSON.stringify(eval("(" + data + ")"));
                var recvData = JSON.parse(parsed_data);
                var hitsArray = recvData['hits']['hits'];
                _.each(hitsArray, function(obj) {
                    var likelihood = computeLikelihood(obj['_source']);
                    if (likelihood > 0) {
                        $('tbody').append(constructDiv(obj, likelihood));
                    }
                });
            }
        });
        $('.box').val('');
    });
});

function constructDiv(obj, likelihood) {
    return '<tr><td class="disease-name" value="'+obj['_source']+'">'+obj['_source']['disease']+' ('+likelihood+'%)</td></tr>';
}

function computeLikelihood(disease) {
    var symptoms = $.map(disease['symptoms'], function(n,i){return n.toLowerCase();})
    var total = symptoms.length;
    var i = 0;
    _.each(chosen, function (symptom) {
        if ($.inArray(symptom.toLowerCase(), symptoms) > -1) {
            i += 1;
        }
    });

    if (chosen.length > symptoms.length) { // way more symptoms
        return 0;
    }

    var retval = ((i/total) * 100);
    if (retval > 100) {
        return 100;
    }
    return retval.toFixed(2);
}