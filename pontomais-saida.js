// ==UserScript==
// @name         Pontomais Saída
// @match        https://app2.pontomais.com.br/*
// @description  Mostra hora de saída no WebApp Pontomais
// @version      0.2.1
// ==/UserScript==
const MSEC_TO_MIN = 60_000;
const CHECK_LOADED_INTERVAL = 3000; //mseconds
const zeroPad = (num, places) => String(num).padStart(places, '0');

function main() {
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

        if ((clocks.length < 3) || (clocks.length % 2 == 0)) {
            console.log("Batidas insuficientes ou dia já finalizado");
            return;
        }

        let clockOut = calculateClockOut(clocks);
        displayClockOut(clockOut);
    }, CHECK_LOADED_INTERVAL)

}


function parseTodayClockRecords(inOutTodayElement) {
    let inOutText = inOutTodayElement.attributes.title.value;
    return inOutText.split(' - ');
}


function calculateClockOut(clocks) {
    let workTime = 0
    for (let i = 0; i < clocks.length - 1; i+=2) {
        let inClock = new Date(`0 ${clocks[i]}`);
        let outClock = new Date(`0 ${clocks[i+1]}`);

        workTime += (outClock - inClock) / MSEC_TO_MIN;
    }
    let lastClock = new Date(`0 ${clocks[clocks.length - 1]}`);

    let expectedOutMin = 480 - workTime;
    let expectedOutClock = new Date(lastClock.getTime());
    expectedOutClock.setTime(expectedOutClock.getTime() + expectedOutMin * MSEC_TO_MIN);
    return expectedOutClock;
}


function displayClockOut(outDate) {
    let clockOutElement = document.querySelector('table tr td[aria-colindex="9"] div > div');
    let clockOutText = `${outDate.getHours()}:${zeroPad(outDate.getMinutes(), 2)}`;
    clockOutElement.innerHTML = `<span style="font-weight: bolder">🌇 ${clockOutText}</span>`;
}


main();
