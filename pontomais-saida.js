// ==UserScript==
// @name         Pontomais Saída
// @match        https://app2.pontomais.com.br/*
// @description  Mostra hora de saída no WebApp Pontomais
// @version      0.1
// ==/UserScript==
const MSEC_TO_MIN = 60_000;
const CHECK_LOADED_INTERVAL = 3000; //mseconds
const zeroPad = (num, places) => String(num).padStart(places, '0');

(function() {
    'use strict';

    console.log("'Pontomais Saída' iniciado.");

    const intervalId = setInterval(() => {
        let inOutTodayElement = document.querySelector('table tr td[aria-colindex="5"] span')
        if (! inOutTodayElement) {
            return;
        } else {
            clearInterval(intervalId);
        }

        let clocks = parseTodayClockRecords(inOutTodayElement);

        if (clocks.length != 3) {
            console.log("'Retorno do almoço' não encontrado.");
            return;
        }

        let clockOut = calculateClockOut(clocks);
        displayClockOut(clockOut);
    }, CHECK_LOADED_INTERVAL)

})();


function parseTodayClockRecords(inOutTodayElement) {
    let inOutText = inOutTodayElement.attributes.title.value;
    return inOutText.split(' - ');
}


function calculateClockOut(clocks) {
    let inClock = new Date(`0 ${clocks[0]}`);
    let lunchOutClock = new Date(`0 ${clocks[1]}`);
    let lunchInClock = new Date(`0 ${clocks[2]}`);

    let morning = (lunchOutClock - inClock) / MSEC_TO_MIN;
    let expectedAfternoonMin = 480 - morning;
    // Sum `expectedAfternoonMin` to lunchInClock and return.
    let outClock = new Date(lunchInClock.getTime());
    outClock.setTime(lunchInClock.getTime() + expectedAfternoonMin * MSEC_TO_MIN);
    return outClock;
}


function displayClockOut(outDate) {
    let clockOutElement = document.querySelector('table tr td[aria-colindex="9"] div > div');
    let clockOutText = `${outDate.getHours()}:${zeroPad(outDate.getMinutes(), 2)}`;
    clockOutElement.innerHTML = `<span style="font-weight: bolder">🌇 ${clockOutText}</span>`;
}
