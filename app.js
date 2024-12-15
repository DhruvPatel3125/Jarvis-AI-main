const btn = document.querySelector(".talk");
const content = document.querySelector(".content");

function speak(text) {
  const text_speak = new SpeechSynthesisUtterance(text);

  text_speak.rate = 1;
  text_speak.volume = 1;
  text_speak.pitch = 1;

  window.speechSynthesis.speak(text_speak);
}

function wishMe() {
  var day = new Date();
  var hour = day.getHours();

  if (hour >= 0 && hour < 12) {
    speak("Good Morning Sir...");
  } else if (hour >= 12 && hour < 17) {
    speak("Good Afternoon Sir...");
  } else {
    speak("Good Evening Sir...");
  }
}

window.addEventListener("load", () => {
  speak("Initializing JARVIS...");
  wishMe();
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const currentIndex = event.resultIndex;
  const transcript = event.results[currentIndex][0].transcript;
  content.textContent = transcript;
  takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
  content.textContent = "Listening...";
  recognition.start();
});

function takeCommand(message) {
  if (message.includes("hey") || message.includes("hello")) {
    speak("Hello Sir, How May I Help You?");
  } else if (message.includes("open google")) {
    window.open("https://google.com", "_blank");
    speak("Opening Google...");
  } else if (message.includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    speak("Opening Youtube...");
  } else if (message.includes("open facebook")) {
    window.open("https://facebook.com", "_blank");
    speak("Opening Facebook...");
  } else if (
    message.includes("what is") ||
    message.includes("who is") ||
    message.includes("what are")
  ) {
    window.open(
      `https://www.google.com/search?q=${message.replace(" ", "+")}`,
      "_blank"
    );
    const finalText =
      "This is what I found on the internet regarding " + message;
    speak(finalText);
  } else if (message.includes("wikipedia")) {
    window.open(
      `https://en.wikipedia.org/wiki/${message
        .replace("wikipedia", "")
        .trim()}`,
      "_blank"
    );
    const finalText = "This is what I found on Wikipedia regarding " + message;
    speak(finalText);
  } else if (message.includes("time")) {
    const time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    const finalText = "The current time is " + time;
    speak(finalText);
  } else if (message.includes("date")) {
    const date = new Date().toLocaleString(undefined, {
      month: "short",
      day: "numeric",
    });
    const finalText = "Today's date is " + date;
    speak(finalText);
  } else if (message.includes("calculator")) {
    window.open("Calculator:///");
    const finalText = "Opening Calculator";
    speak(finalText);
  } else if (message.includes("weather in")) {
    const location = message.replace("weather in", "").trim();
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_API_KEY&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        const weather = `The weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
        speak(weather);
      })
      .catch(() => speak("Sorry, I couldn't fetch the weather information."));
  } else if (message.includes("news")) {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_NEWS_API_KEY`
    )
      .then((response) => response.json())
      .then((data) => {
        const headlines = data.articles
          .slice(0, 3)
          .map((article, index) => `${index + 1}. ${article.title}`)
          .join(" ");
        speak(`Here are the top headlines: ${headlines}`);
      })
      .catch(() => speak("Sorry, I couldn't fetch the news."));
  } else if (message.includes("calculate")) {
    try {
      const calculation = message.replace("calculate", "").trim();
      const result = eval(calculation); // Be cautious with eval, sanitize inputs if necessary
      speak(`The result of ${calculation} is ${result}.`);
    } catch {
      speak("I couldn't calculate that. Please try again.");
    }
  } else if (message.includes("tell me a joke")) {
    fetch("https://official-joke-api.appspot.com/random_joke")
      .then((response) => response.json())
      .then((data) => {
        speak(`${data.setup} ... ${data.punchline}`);
      })
      .catch(() => speak("Sorry, I couldn't fetch a joke at the moment."));
  } else if (
    message.includes("motivate me") ||
    message.includes("inspire me")
  ) {
    const quotes = [
      "Believe in yourself and all that you are.",
      "You are capable of amazing things.",
      "Your limitation—it's only your imagination.",
      "Push yourself, because no one else is going to do it for you.",
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    speak(randomQuote);
  } else if (message.includes("tell me a fact")) {
    fetch("https://uselessfacts.jsph.pl/random.json?language=en")
      .then((response) => response.json())
      .then((data) => speak(data.text))
      .catch(() => speak("I couldn't fetch a fact at the moment."));
  } else if (message.includes("set volume to")) {
    const volumeLevel = parseInt(message.replace("set volume to", "").trim());
    if (!isNaN(volumeLevel) && volumeLevel >= 0 && volumeLevel <= 100) {
      speak(`Setting volume to ${volumeLevel} percent.`);
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length) {
          audioTracks[0].applyConstraints({ volume: volumeLevel / 100 });
        }
      });
    } else {
      speak("Please provide a valid volume level between 0 and 100.");
    }
  } else if (message.includes("movie details")) {
    const movieName = message.replace("movie details", "").trim();
    fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=YOUR_OMDB_API_KEY`)
      .then((response) => response.json())
      .then((data) => {
        if (data.Response === "True") {
          const movieInfo = `Here are the details for ${data.Title}: Released in ${data.Year}, Directed by ${data.Director}, and starring ${data.Actors}. Plot: ${data.Plot}`;
          speak(movieInfo);
        } else {
          speak(`I couldn't find details about ${movieName}.`);
        }
      })
      .catch(() => speak("There was an error fetching movie details."));
  } else if (message.includes("recipe for")) {
    const dish = message.replace("recipe for", "").trim();
    fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${dish}&apiKey=YOUR_SPOONACULAR_API_KEY`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const recipe = `I found a recipe for ${data.results[0].title}. You can check it out here: ${data.results[0].sourceUrl}`;
          speak(recipe);
        } else {
          speak(`I couldn't find a recipe for ${dish}.`);
        }
      })
      .catch(() => speak("There was an error fetching recipes."));
  } else if (message.includes("crypto price of")) {
    const crypto = message.replace("crypto price of", "").trim().toLowerCase();
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data[crypto]) {
          const price = `The current price of ${crypto} is $${data[crypto].usd}.`;
          speak(price);
        } else {
          speak(`I couldn't find the price for ${crypto}.`);
        }
      })
      .catch(() => speak("There was an error fetching cryptocurrency prices."));
  } else if (message.includes("stock price of")) {
    const company = message.replace("stock price of", "").trim();
    fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${company}&interval=1min&apikey=YOUR_ALPHA_VANTAGE_API_KEY`
    )
      .then((response) => response.json())
      .then((data) => {
        const timeSeries = data["Time Series (1min)"];
        const latestTime = Object.keys(timeSeries)[0];
        const stockPrice = timeSeries[latestTime]["1. open"];
        speak(`The latest stock price of ${company} is $${stockPrice}.`);
      })
      .catch(() => speak("There was an error fetching stock prices."));
  } else if (message.includes("calories in")) {
    const foodItem = message.replace("calories in", "").trim();
    fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
      method: "POST",
      headers: {
        "x-app-id": "YOUR_APP_ID",
        "x-app-key": "YOUR_APP_KEY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: foodItem }),
    })
      .then((response) => response.json())
      .then((data) => {
        const calories = data.foods[0].nf_calories;
        speak(`The approximate calories in ${foodItem} are ${calories}.`);
      })
      .catch(() => speak("I couldn't find calorie information for that item."));
  } else if (message.includes("set a reminder")) {
    const reminder = message.replace("set a reminder", "").trim();
    const time = prompt("In how many minutes?");
    if (time && !isNaN(time)) {
      setTimeout(() => {
        new Notification("Reminder", { body: reminder });
        speak(`Reminder: ${reminder}`);
      }, time * 60000);
      speak(`I will remind you in ${time} minutes.`);
    } else {
      speak("Invalid time entered.");
    }
  } else if (message.includes("translate")) {
    const [_, text, lang] = message.split(" to ");
    fetch(
      `https://translation.googleapis.com/language/translate/v2?key=YOUR_GOOGLE_TRANSLATE_API_KEY`,
      {
        method: "POST",
        body: JSON.stringify({
          q: text.trim(),
          target: lang.trim(),
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const translatedText = data.data.translations[0].translatedText;
        speak(`The translation is: ${translatedText}`);
      })
      .catch(() => speak("I couldn't translate that text."));
  } else if (message.includes("lyrics of")) {
    const song = message.replace("lyrics of", "").trim();
    fetch(`https://api.lyrics.ovh/v1/artist/${song}`)
      .then((response) => response.json())
      .then((data) =>
        speak(data.lyrics || "Sorry, I couldn't find the lyrics.")
      )
      .catch(() => speak("There was an error fetching the lyrics."));
  } else if (message.includes("ask me a question")) {
    fetch("https://opentdb.com/api.php?amount=1")
      .then((response) => response.json())
      .then((data) => {
        const question = data.results[0].question;
        const answer = data.results[0].correct_answer;
        speak(question);
        setTimeout(() => speak(`The answer is: ${answer}`), 10000);
      })
      .catch(() => speak("I couldn't fetch a trivia question."));
  } else if (message.includes("play music")) {
    const song = message.replace("play music", "").trim();
    window.open(
      `https://www.youtube.com/results?search_query=${song}`,
      "_blank"
    );
    speak(`Playing music for ${song}.`);
  } else if (message.includes("turn on the lights")) {
    fetch("http://YOUR_IOT_DEVICE_IP/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "turn_on_lights" }),
    })
      .then(() => speak("Turning on the lights."))
      .catch(() => speak("I couldn't control the lights."));
  } else {
    window.open(
      `https://www.google.com/search?q=${message.replace(" ", "+")}`,
      "_blank"
    );
    const finalText = "I found some information for " + message + " on Google";
    speak(finalText);
  }
}
