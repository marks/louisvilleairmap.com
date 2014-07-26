function getURLParameterByKey(name,hash) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  if(hash == true){
    var regex = new RegExp("[\\?&#]" + name + "=([^&#]*)")
    var results = regex.exec(location.hash)
  }
  else {
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
    var results = regex.exec(location.search)
  }
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function addOrReplacePairInHash(key,new_value){
  var current_value = getURLParameterByKey(key,true)
  if(current_value){
    if(current_value == new_value){ } // do nothing
    else{
      // replace value
      var current_hash = location.hash
      location.hash = current_hash.replace(key+'='+encodeURIComponent(current_value),key+'='+new_value)
    }
  } else {
    location.hash += '&'+key+'='+new_value
  }
}
function celsiusToFahrenheit(value){
  return parseFloat(value) * 9 / 5 + 32
}

function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function aqiToColor(aqi){
  var color;
  if (aqi <= 50) { color = "#00E400" }
  else if(aqi > 51 && aqi <= 100) { color = "#FFFF00"}
  else if(aqi > 101 && aqi <= 150) { color = "#FF7E00"}
  else if(aqi > 151 && aqi <= 200) { color = "#FF0000"}
  else if(aqi > 201 && aqi <= 300) { color = "#99004C"}
  else if(aqi > 301 && aqi <= 500) { color = "#4C0026"}
  else { color = "#000000"}
  return color;
}

function move_row_to_top(row){
  $(row).parent().prepend($(row));
}

function formatSensorDetails(data){
  var html = ""
  if(data.prevailing_aqi){
    html += " <div class='alert' style='padding: 5px; background-color:"+data.prevailing_aqi.aqi_cat.color+"; color:"+data.prevailing_aqi.aqi_cat.font+"'>This location's air is "+data.prevailing_aqi.aqi_cat.name+"</div> "
  }
  var sensor_table = "<table class='table table-striped'><tr><th>Sensor</th><th>Latest Reading</th></tr></tr>"
  html += sensor_table
  $.each(data.datastreams, function(name,item){
    if(item){
      html += "<tr>"
      html += "<td>"+name+"</td>"
      html += "<td>"
      if(item.computed_aqi > 0){
        html += " <span class='alert' style='padding: 2px; background-color:"+item.aqi_cat.color+"; color:"+item.aqi_cat.font+"'>"+item.aqi_cat.name+" (AQI = "+item.computed_aqi+")</span> "
      }
      html += " " + item.value + " " + item.unit
      if(item.datetime){ html += " (" + moment(item.datetime+"Z").fromNow() +  ")"  }
      else if(item.time){ html += " (" + moment(item.date + " " + item.time).fromNow() +  ")" }
      else {html += " (" + moment(item.date ).fromNow() +  ")" }
        html += "</td>"
      html += "</tr>"
    }        
  })
  html += "</table>"
  if(html == sensor_table+"</table>"){html = "<em>No recent data available</em>"}
  return html
}
