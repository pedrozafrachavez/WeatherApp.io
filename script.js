let weather={
    "apikey": "089c8789124ab59704ac780629f0b313",
// Add API KEY
    fetchWeather:function(city){
        fetch("https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid="+this.apikey).then((response)=>response.json()).then((data)=>this.displayWeather(data));
     },
    displayWeather: function(data){
        const{name}=data;
        const{icon,description} = data.weather[0];
        const{temp, humidity}=data.main;
        const{speed}=data.wind;
        const{lon,lat}=data.coord;
        document.querySelector(".city").innerText="Weather in " + name;
        //Example Url 
        document.querySelector(".icon").src="https://openweathermap.org/img/wn/"+icon+"@2x.png";
        document.querySelector(".description").innerText=description;
        document.querySelector(".temp").innerText=temp+"°F";
        document.querySelector(".lon").innerText="Longitude: "+lon+"";
        document.querySelector(".lat").innerText="Latitude: "+lat+"";
        document.querySelector(".humidity").innerText="Humidity: "+humidity+"%";
        document.querySelector(".wind").innerText="Wind Speed: "+speed+"mph";
        document.querySelector(".weather").classList.remove("loading");
        document.querySelector(".lon").classList.remove("loading");
        
        document.getElementById("map").src="https://www.bing.com/maps/embed?h=400&w=500&cp="+lat+"~"+lon+"&lvl=11&typ=d&sty=h&src=SHELL&FORM=MBEDV8";
        document.body.style.backgroundImage="url('https://source.unsplash.com/featured/?"+name+"')";

    },
    search:function(){
        this.fetchWeather(document.querySelector(".search-bar").value); 
    },
    
};



//Searches content of Search Bar
document.querySelector(".search-button").addEventListener("click",function(){
    weather.search();
}
);

document.querySelector(".search-bar").addEventListener("keyup",function(event){
    if(event.key=="Enter"){
        weather.search();
    }
});

weather.fetchWeather("98848" );
