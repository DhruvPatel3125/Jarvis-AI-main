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
    speak("Good Morning Boss...");
  } else if (hour >= 12 && hour < 17) {
    speak("Good Afternoon Master...");
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
