

//перевод времени
function convertTimestamp(timestamp) {
            var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
            yyyy = d.getFullYear(),
                mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
                dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
                hh = d.getHours(),
                h = hh,
                min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
                ampm = 'AM',
                time;

                if (hh > 12) {
                	h = hh - 12;
                	ampm = 'PM';
                } else if (hh === 12) {
                	h = 12;
                	ampm = 'PM';
                } else if (hh == 0) {
                	h = 12;
                }
                time = h + ':' + min + ' ' + ampm;
                return time;
            }

//перевод дня и месяца
            function getWeekDay(date) {
            	let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            	return days[date.getDay()];
            }
            function getMonth(date) {
            	let month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL','AUG','SEP','OCT','NOV','DEC'];
            	return month[date.getMonth()];
            }


            var iconurl = "";

//функция спработает при нажатии Enter (для введенного города)
            $(document).keydown(function(e) {
            	if (e.keyCode === 13) {
            		$("#p3").html("http://api.openweathermap.org/data/2.5/weather?q=" + $('#townNameINPT').val() + "&units=metric&appid=26077b73c02a5626fb2c9467ca4e0484");
            		$("#p4").html("http://api.openweathermap.org/data/2.5/find?q=" + $('#townNameINPT').val() + "&cnt=4&units=metric&appid=26077b73c02a5626fb2c9467ca4e0484");
            		$("#p5").html("http://api.openweathermap.org/data/2.5/forecast?q=" + $('#townNameINPT').val() +"&units=metric&appid=26077b73c02a5626fb2c9467ca4e0484");

//краткая погода на день
            		$.ajax({
            			url: $("#p3").text(),
            			type: 'POST',
            			dataType: 'json',
            			success: function(data) {
            				iconurl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

            				$("#temp").html(`<div class="weath">
            					<img id="iconWeather" >
            					<p>${data.weather[0].main}</p>
            					</div>
            					<div class="temperature">
            					<p>${Math.round(data.main.temp).toFixed(0)} &degC</p>
            					<p class="real">Real Feel ${Math.round(data.main.feels_like).toFixed(0)} &degC</p>
            					</div>
            					<div class="sun">
            					<p>Sunrice: ${convertTimestamp(data.sys.sunrise)}</p>
            					<p>Sunset: ${convertTimestamp(data.sys.sunset)}</p>
            					</div>`);
            				$('#iconWeather').attr('src', iconurl);
            			}
            		});


//почасовая погода
            		$.ajax({
            			url: $("#p5").text(),
            			type: 'POST',
            			dataType: 'json',
            			success: function(data) {
            				var str = ``;
            				var j = 0;

            				for (var i = 0; i < 7; i++) {
            					iconurl = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
            					str += `<div class="datTime"><p>${convertTimestamp(data.list[i].dt)}</p><img src="${iconurl}"><p <p id="hourlyTemp">${Math.round(data.list[i].main.temp).toFixed(0)}&degC</p>`;
            					str += `</div>`
            				}

            				$("#hourlyWeather").html(str);

            			}

            		});


//погода для близлежайших городов
            		$.ajax({
            			url: $("#p4").text(),
            			type: 'POST',
            			dataType: 'json',
            			success: function(data) {
            				var str = ``;
            				if(data.count<4){
            					for (var i = 0; i < data.count; i++) {
            						iconurl = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
            						str += `<div class="OneTown"><p>${data.list[i].name}</p>
            						<img  src="${iconurl}"><p>${Math.round(data.list[i].main.temp).toFixed(0)}C</p></div>`;
            					}
            				}
            				else
            				{
            					for (var i = 0; i < 4; i++) {
            						iconurl = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";

            						str += `<div class="OneTown"><p>${data.list[i].name}</p>
            						<img  src="${iconurl}"><p>${Math.round(data.list[i].main.temp).toFixed(0)}C</p></div>`;
            					}
            				}
            				$("#towns").html(str);
            			}
            		});


//погода на пять дней
            		$.ajax({
            			url: $("#p5").text(),
            			type: 'POST',
            			dataType: 'json',
            			success: function(data) {
            				var str = ``;
            				var j = 0;
            				var t = 2;
            				var dayWeek = new Date();
            				var day = new Date();
            				str += `<div class="day" id="q1"><p>${getWeekDay(dayWeek)}</p><p>${getMonth(dayWeek)}, ${day.getDate()}</p>`;
            				for (var i = 0; i < 40; i++) {
            					if (j === 8) {
            						str += `</div>`;
            						str += `<div class="day" id="q${t}">`;
            						j = 0;
            						dayWeek.setDate(dayWeek.getDay() + 1);
            						day.setDate(day.getDate() + 1);
            						str += `<p>${getWeekDay(dayWeek)}</p><p>${getMonth(day)}, ${day.getDate()}</p>`;
            						t++;
            					}
            					if (j === 4) {
            						iconurl = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";

            						str += `<img src="${iconurl}">
            						<p>${Math.round(data.list[i].main.temp).toFixed(0)}&degC</p>`;
            					}

            					j++;
            				}
            				str += `</div>`;

            				$("#fiveDays").html(str);

            			}


            		});


            		$.ajax({
            			url: $("#p5").text(),
            			type: 'POST',
            			dataType: 'json',
            			success: function(data) {
            				var str = ``;
            				var j = 0;

            				for (var i = 0; i < 7; i++) {
            					iconurl = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
            					str += `<div class="DayWeather"><p>${convertTimestamp(data.list[i].dt)}</p><img src="${iconurl}"><p>${data.list[i].weather[0].main}</p><p>${Math.round(data.list[i].main.temp).toFixed(0)}&degC</p>`;
            					str += `</div>`
            				}

            				$("#OneDay").html(str);

            			}

            		});

            	}
            });
