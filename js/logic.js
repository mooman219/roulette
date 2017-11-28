// @ts-check
"use strict";
HTMLSelectElement.prototype.getSelectedValue = function () {
    return this.options[this.selectedIndex].value;
}
class Animation {
    static addProperty(element, key, value) {
        var apis = ['Webkit', 'Moz', 'O', 'ms', 'Khtml', ''];
        apis.forEach(function (api) {
            element.style[api + key] = value;
        });
    }
    static removeProperty(element, key) {
        var apis = ['Webkit', 'Moz', 'O', 'ms', 'Khtml', ''];
        apis.forEach(function (api) {
            element.style.removeProperty(api + key);
        });
    }
    static rotate(element, angle, duration) {
        Animation.addProperty(element, 'transform', 'rotate(' + angle + 'deg)');
        if (duration) {
            Animation.addProperty(element, 'transition-timing-function', 'ease-in-out');
            Animation.addProperty(element, 'transition-duration', duration + 's');
        } else {
            Animation.removeProperty(element, 'transition-timing-function');
            Animation.removeProperty(element, 'transition-duration');
        }
    }
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
class Widget {
    constructor(parent, title, body) {
        this.parent = parent;
        this.parent.innerHTML = `
        <div class="card">
            <div class="card-header text-center">${title}</div>
            <div class="card-body">
                <div></div>
                <div>${body}</div>
            </div>
        </div>`;
        this.alerts = this.parent.querySelectorAll('div')[3];
        this.body = this.parent.querySelectorAll('div')[4];
    }
    get show() {
        return () => {
            this.parent.style.display = 'block';
        };
    }
    get hide() {
        return () => {
            this.parent.style.display = 'none';
        };
    }
    get clearAlerts() {
        return () => {
            this.alerts.innerHTML = '';
        }
    }
    get addAlert() {
        return (type, message) => {
            this.alerts.innerHTML += `<div class="alert alert-${type} alert-dismissible" role="alert">${message}<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button></div>`;
        }
    }
}
class WidgetLog extends Widget {
    constructor(parent) {
        super(parent, 'Logs', `
        <h4 class="card-title">Local log information.<button type="button" class="btn btn-danger btn-sm float-right">Purge logs</button></h4>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">User ID</th>
                    <th scope="col">Group</th>
                    <th scope="col">Cash</th>
                    <th scope="col">Bet</th>
                    <th scope="col">Chosen Color</th>
                    <th scope="col">Actual Color</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <button type="button" class="btn btn-primary">Download logs</button>
        <button type="button" class="btn btn-secondary">View setup</button>`);
        this.elements = {
            table: this.body.querySelectorAll('table')[0],
            body: this.body.querySelectorAll('tbody')[0],
            purgeLogs: this.body.querySelectorAll('button')[0],
            downloadLogs: this.body.querySelectorAll('button')[1],
            viewSetup: this.body.querySelectorAll('button')[2],
        };
    }
    get addEntry() {
        return (user, group, cash, bet, pick, result) => {
            var now = new Date();
            var entry = {
                date: now.toLocaleDateString(),
                time: now.toLocaleTimeString(),
                user: user,
                group: group,
                cash: cash,
                bet: bet,
                pick: pick,
                result: result
            }
            this.appendRow(entry);
            this.appendStorage(entry);
        }
    }
    get loadEntries() {
        return () => {
            var entriesRaw = window.localStorage.getItem('log');
            if (entriesRaw) {
                var entries = JSON.parse(entriesRaw);
                var self = this;
                entries.forEach(function(entry) {
                    self.appendRow(entry);
                });
            }
        }
    }
    get clearEntries() {
        return () => {
            var tbody = document.createElement('tbody');
            this.elements.table.replaceChild(tbody, this.elements.body);
            this.elements.body = tbody;
            window.localStorage.setItem('log', JSON.stringify([]));
        }
    }
    get appendRow() {
        return (entry) => {
            var row = this.elements.body.insertRow(this.elements.body.rows.length);
            row.insertCell(0).innerHTML = entry.date;
            row.insertCell(1).innerHTML = entry.time;
            row.insertCell(2).innerHTML = '#' + entry.user;
            row.insertCell(3).innerHTML = entry.group;
            row.insertCell(4).innerHTML = '$' + entry.cash;
            row.insertCell(5).innerHTML = '$' + entry.bet;
            row.insertCell(6).innerHTML = entry.pick;
            row.insertCell(7).innerHTML = entry.result;
            if (entry.pick === entry.result) {
                row.className = 'table-success';
            } else {
                row.className = 'table-warning';
            }
        }
    }
    get appendStorage() {
        return (entry) => {
            var entriesRaw = window.localStorage.getItem('log');
            var entries = entriesRaw ? JSON.parse(entriesRaw) : [];
            entries.push(entry);
            window.localStorage.setItem('log', JSON.stringify(entries));
        }
    }
}
class WidgetSetup extends Widget {
    constructor(parent) {
        super(parent, 'Setup', `
        <h4 class="card-title">Please enter your information.</h4>
        <table class="table table-form">
            <tbody>
                <tr>
                    <td><b>User ID</b></td>
                    <td class="input-group">
                        <span class="input-group-addon">#</span>
                        <input type="number" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td><b>Starting Cash</b></td>
                    <td class="input-group">
                        <span class="input-group-addon">$</span>
                        <input type="number" class="form-control">
                    </td>
                </tr>
                <tr>
                    <td><b>Group</b></td>
                    <td>
                        <select class="form-control">
                            <option selected value="1">Group A</option>
                            <option value="2">Group B</option>
                            <option value="3">Group C</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td colspan="2"><button class="btn btn-block btn-primary" type="button">Start</button></td>
                </tr>
                <tr>
                    <td colspan="2"><button class="btn btn-block btn-secondary" type="button">View Logs</button></td>
                </tr>
            </tbody>
        </table>`);
        this.elements = {
            user: this.body.querySelectorAll('input')[0],
            cash: this.body.querySelectorAll('input')[1],
            group: this.body.querySelectorAll('select')[0],
            submit: this.body.querySelectorAll('button')[0],
            viewLogs: this.body.querySelectorAll('button')[1],
        };
    }
    get validate() {
        return () => {
            this.clearAlerts();
            var valid = true;
            var stats = this.getValues();
            if (this.elements.user.value === '') {
                this.addAlert('danger', 'Please enter a user id.');
                valid = false;
            } else if (stats.user < 0) {
                this.addAlert('danger', 'Please enter a positive user id.');
                valid = false;
            }
            if (this.elements.cash.value === '') {
                this.addAlert('danger', 'Please enter a cash amount.');
                valid = false;
            } else if (stats.cash < 0) {
                this.addAlert('danger', 'Please enter a positive cash amount.');
                valid = false;
            }
            return valid;
        };
    }
    get getValues() {
        return () => {
            return {
                user: Number(this.elements.user.value),
                cash: Number(this.elements.cash.value),
                group: this.elements.group.getSelectedValue(),
            };
        }
    }
}
class WidgetGame extends Widget {
    constructor(parent) {
        super(parent, 'Roulette', `
        <table class="table table-form">
        <tbody>
            <tr>
                <td><b>User ID</b></td>
                <td class="input-group">
                    <span class="input-group-addon">#</span>
                    <input type="number" class="form-control" readonly>
                </td>
            </tr>
            <tr>
                <td><b>Cash</b></td>
                <td class="input-group">
                    <span class="input-group-addon">$</span>
                    <input type="number" class="form-control" readonly>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="wheel">
                        <div class="spinner">
                            <div class="ball">
                                <span></span>
                            </div>
                            <div class="platebg"></div>
                            <div class="platetop"></div>
                            <div class="topnodebox">
                                <div class="silvernode"></div>
                                <div class="topnode silverbg"></div>
                                <span class="top silverbg"></span>
                                <span class="right silverbg"></span>
                                <span class="down silverbg"></span>
                                <span class="left silverbg"></span>
                            </div>
                            <div class="pieContainer">
                                <div class="pieBackground"></div>
                                <div class="hold" id="rSlice0" style="transform: rotate(0deg);"><div class="num">0</div><div class="pie greenbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice1" style="transform: rotate(9.72973deg);"><div class="num">32</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice2" style="transform: rotate(19.4595deg);"><div class="num">15</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice3" style="transform: rotate(29.1892deg);"><div class="num">19</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice4" style="transform: rotate(38.9189deg);"><div class="num">4</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice5" style="transform: rotate(48.6486deg);"><div class="num">21</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice6" style="transform: rotate(58.3784deg);"><div class="num">2</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice7" style="transform: rotate(68.1081deg);"><div class="num">25</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice8" style="transform: rotate(77.8378deg);"><div class="num">17</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice9" style="transform: rotate(87.5676deg);"><div class="num">34</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice10" style="transform: rotate(97.2973deg);"><div class="num">6</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice11" style="transform: rotate(107.027deg);"><div class="num">27</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice12" style="transform: rotate(116.757deg);"><div class="num">13</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice13" style="transform: rotate(126.486deg);"><div class="num">36</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice14" style="transform: rotate(136.216deg);"><div class="num">11</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice15" style="transform: rotate(145.946deg);"><div class="num">30</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice16" style="transform: rotate(155.676deg);"><div class="num">8</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice17" style="transform: rotate(165.405deg);"><div class="num">23</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice18" style="transform: rotate(175.135deg);"><div class="num">10</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice19" style="transform: rotate(184.865deg);"><div class="num">5</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice20" style="transform: rotate(194.595deg);"><div class="num">24</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice21" style="transform: rotate(204.324deg);"><div class="num">16</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice22" style="transform: rotate(214.054deg);"><div class="num">33</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice23" style="transform: rotate(223.784deg);"><div class="num">1</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice24" style="transform: rotate(233.514deg);"><div class="num">20</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice25" style="transform: rotate(243.243deg);"><div class="num">14</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice26" style="transform: rotate(252.973deg);"><div class="num">31</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice27" style="transform: rotate(262.703deg);"><div class="num">9</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice28" style="transform: rotate(272.432deg);"><div class="num">22</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice29" style="transform: rotate(282.162deg);"><div class="num">18</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice30" style="transform: rotate(291.892deg);"><div class="num">29</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice31" style="transform: rotate(301.622deg);"><div class="num">7</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice32" style="transform: rotate(311.351deg);"><div class="num">28</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice33" style="transform: rotate(321.081deg);"><div class="num">12</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice34" style="transform: rotate(330.811deg);"><div class="num">35</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice35" style="transform: rotate(340.541deg);"><div class="num">3</div><div class="pie redbg" style="transform: rotate(9.73deg);"></div></div><div class="hold" id="rSlice36" style="transform: rotate(350.27deg);"><div class="num">26</div><div class="pie greybg" style="transform: rotate(9.73deg);"></div></div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="input-group">
                        <span class="input-group-btn">
                            <button class="btn btn-danger" type="button">Bet on red</button>
                        </span>
                        <span class="input-group-addon">$</span>
                        <input type="number" class="form-control" placeholder="Bet">
                        <span class="input-group-btn">
                            <button class="btn btn-dark" type="button">Bet on black</button>
                        </span>
                    </div>
                </td>
            </tr>
        </tbody>
        </table>
        `);
        this.elements = {
            user: this.body.querySelectorAll('input')[0],
            cash: this.body.querySelectorAll('input')[1],
            bet: this.body.querySelectorAll('input')[2],
            spin: {
                red: this.body.querySelectorAll('button')[0],
                black: this.body.querySelectorAll('button')[1]
            },
            numbersBackground: this.body.getElementsByClassName('pieContainer')[0],
            ballBackground: this.body.getElementsByClassName('ball')[0],
            handle: this.body.getElementsByClassName('topnodebox')[0],
        };
        this.wheel = {
            order: [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26],
            red: [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3],
            black: [15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26],
            locations: [],
        };
        var temparc = 360 / this.wheel.order.length;
        for (var i = 0; i < this.wheel.order.length; i++) {
            this.wheel.locations[this.wheel.order[i]] = i * temparc;
        }
    }
    get spinRandom() {
        return async () => {
            var number = this.wheel.order[Math.floor(Math.random() * this.wheel.order.length)];
            await this.spinTo(number);
            if (this.wheel.red.includes(number)) {
                return 'red';
            } else if (this.wheel.black.includes(number)) {
                return 'black';
            }
            return 'green';
        };
    }
    get spinRed() {
        return async () => {
            var number = this.wheel.red[Math.floor(Math.random() * this.wheel.red.length)];
            await this.spinTo(number);
            return 'red'
        };
    }
    get spinBlack() {
        return async () => {
            var number = this.wheel.black[Math.floor(Math.random() * this.wheel.black.length)];
            await this.spinTo(number);
            return 'black'
        };
    }
    get spinTo() {
        return async (number) => {
            // Lock the UI
            this.elements.bet.readOnly = true;
            this.elements.spin.red.disabled = true;
            this.elements.spin.black.disabled = true;
            // Reset the animation
            Animation.rotate(this.elements.numbersBackground, 0);
            Animation.rotate(this.elements.handle, 0);
            Animation.rotate(this.elements.ballBackground, 0);
            await Animation.sleep(300);
            // Set instance variables
            var wheelTime = 2;
            var ballTime = 3;
            var temp = this.wheel.locations[number] + 4;
            var backgroundAngle = Math.floor(Math.random() * 360 + 1);
            var backgroundDest = 360 * wheelTime + backgroundAngle;
            var ballAngle = backgroundAngle + temp;
            var ballDest = -360 * ballTime - (360 - ballAngle);
            // Apply the animation
            Animation.rotate(this.elements.numbersBackground, backgroundDest, wheelTime);
            Animation.rotate(this.elements.handle, backgroundDest, wheelTime);
            Animation.rotate(this.elements.ballBackground, ballDest, ballTime);
            await Animation.sleep(3500);
            // Unlock the UI
            this.elements.bet.readOnly = false;
            this.elements.spin.red.disabled = false;
            this.elements.spin.black.disabled = false;
        };
    }
    get validate() {
        return () => {
            this.clearAlerts();
            var valid = true;
            var stats = this.getValues();
            if (this.elements.cash.value === '' || stats.cash <= 0) {
                this.addAlert('danger', 'You have no money left to bet.');
                valid = false;
            } else if (this.elements.bet.value === '') {
                this.addAlert('danger', 'Please enter a bet.');
                valid = false;
            } else if (stats.bet < 0) {
                this.addAlert('danger', 'Please enter a positive bet.');
                valid = false;
            } else if (stats.cash < stats.bet) {
                this.addAlert('danger', 'You do not have enough money to make that bet.');
                valid = false;
            }
            return valid;
        };
    }
    get addCash() {
        return (cash) => {
            this.elements.cash.value = Number(this.elements.cash.value) + cash;
        }
    }
    get getValues() {
        return () => {
            return {
                user: Number(this.elements.user.value),
                cash: Number(this.elements.cash.value),
                bet: Number(this.elements.bet.value),
            };
        }
    }
}
class PageMain {
    constructor() {
        this.setup = new WidgetSetup(document.getElementById('Setup'));
        this.setup.elements.submit.onclick = this.performSetup;
        this.setup.elements.viewLogs.onclick = this.viewLogs;

        this.game = new WidgetGame(document.getElementById('Game'));
        this.game.elements.spin.red.onclick = this.pickRed;
        this.game.elements.spin.black.onclick = this.pickBlack;
        this.game.hide();

        this.logs = new WidgetLog(document.getElementById('Log'));
        this.logs.elements.purgeLogs.onclick = this.logs.clearEntries;
        this.logs.elements.viewSetup.onclick = this.viewSetup;
        this.logs.loadEntries();
        this.logs.hide();
    }
    get performSetup() {
        return () => {
            if (this.setup.validate()) {
                var stats = this.setup.getValues();
                this.game.elements.user.value = stats.user;
                this.game.elements.cash.value = stats.cash;
                this.setup.hide();
                this.game.show();
            }
        };
    }
    get viewLogs() {
        return () => {
            this.setup.hide();
            this.logs.show();
        };
    }
    get viewSetup() {
        return () => {
            this.setup.show();
            this.logs.hide();
        };
    }
    get pickRed() {
        return () => {
            this.performSpin('red');
        };
    }
    get pickBlack() {
        return () => {
            this.performSpin('black');
        };
    }
    get performSpin() {
        return async (pick) => {
            if (this.game.validate()) {
                var stats = this.game.getValues();
                var result = await this.game.spinRandom();
                if (result === pick) {
                    this.game.addCash(stats.bet);
                    this.game.addAlert('success', "You've won! Gained $" + stats.bet + ".");
                } else {
                    this.game.addCash(-stats.bet);
                    this.game.addAlert('warning', 'Try again. Lost $' + stats.bet + '.');
                }
                this.logs.addEntry(stats.user, this.setup.getValues().group, stats.cash, stats.bet, pick, result)
            }
        };
    }
}
var debug = new PageMain();
