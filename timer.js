const { interval, fromEvent, operators, merge } = rxjs;
const { takeUntil, map, mapTo, switchMap } = operators;

let secondsInDom = parseInt(document.querySelector(".seconds").innerHTML);
let minsInDom = document.querySelector(".mins").innerHTML * 1;

const interval$ = interval(1000);

let startButton = document.querySelector(".start-btn");
let pauseButton = document.querySelector(".pause-btn");
let resetButton = document.querySelector(".reset-btn");

const startButton$ = fromEvent(startButton, "click");
const pauseButton$ = fromEvent(pauseButton, "click");
const resetButton$ = fromEvent(resetButton, "click");
const pauseOrReset$ = merge(resetButton$, pauseButton$);
startButton$
  .pipe(switchMap(() => interval(1000).pipe(takeUntil(pauseOrReset$))))
  .subscribe((currentSeconds) => {
    currentSeconds++;
    if (currentSeconds % 60 === 0) {
      minsInDom++;
      currentSeconds = 0;
    }
    document.querySelector(".mins").innerHTML = minsInDom;
    document.querySelector(".seconds").innerHTML =
      (secondsInDom + currentSeconds).toString().length < 2
        ? "0" + (secondsInDom + currentSeconds)
        : secondsInDom + currentSeconds;
  });

startButton$.subscribe((click) => {
  console.log("startButton$ clicked: ", click);
  document.querySelector(".thyme-dancers").classList.add("playing");
  document.querySelector("body").classList.add("playing");
  document.querySelector(".thyme-dancers").classList.remove("paused");
  document.querySelector("body").classList.remove("paused");
});
pauseButton$.subscribe((click) => {
  document.querySelector(".thyme-dancers").classList.remove("playing");
  document.querySelector("body").classList.remove("playing");
  document.querySelector(".thyme-dancers").classList.add("paused");
  document.querySelector("body").classList.add("paused");
  secondsInDom = document.querySelector(".seconds").innerHTML * 1;
  console.log("secondsInDom on pause: ", secondsInDom);
});
resetButton$.subscribe((click) => {
  document.querySelector(".thyme-dancers").classList.remove("playing");
  document.querySelector("body").classList.remove("playing");
  document.querySelector(".thyme-dancers").classList.remove("paused");
  document.querySelector("body").classList.remove("paused");
  secondsInDom = 0;
  minsInDom = 0;
  document.querySelector(".mins").innerHTML = "0";
  document.querySelector(".seconds").innerHTML = "00";
});
