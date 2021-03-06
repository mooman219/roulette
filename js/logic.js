// @ts-check
"use strict";
HTMLSelectElement.prototype.getSelectedValue = function () {
    return this.options[this.selectedIndex].value;
};
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
}
class Utility {
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static download(filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    static random(array) {
        return array[Math.floor(Math.random() * array.length)];
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
        this.cardBody = this.parent.querySelectorAll('div')[2];
        this.alerts = this.parent.querySelectorAll('div')[3];
        this.body = this.parent.querySelectorAll('div')[4];
    }
    get setBodyScrollHeight() {
        return (height) => {
            if (height) {
                this.cardBody.style.maxHeight = height;
                this.cardBody.style.overflow = 'auto';
            } else {
                this.cardBody.style.maxHeight = '';
                this.cardBody.style.overflow = '';
            }
        };
    }
    get setBodyPadding() {
        return (top, bottom, left, right) => {
            this.cardBody.style.padding = top + ' ' + right + ' ' + bottom + ' ' + left;
        };
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
            tbody: this.body.querySelectorAll('tbody')[0],
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
                entries.forEach(function (entry) {
                    self.appendRow(entry);
                });
            }
        }
    }
    get clearEntries() {
        return () => {
            var tbody = document.createElement('tbody');
            this.elements.table.replaceChild(tbody, this.elements.tbody);
            this.elements.tbody = tbody;
            window.localStorage.setItem('log', JSON.stringify([]));
        }
    }
    get downloadEntries() {
        return () => {
            var entriesRaw = window.localStorage.getItem('log');
            var output = 'Date,Time,User ID,Group,Cash,Bet,Chosen Color,Actual Color\n'
            if (entriesRaw) {
                var entries = JSON.parse(entriesRaw);
                entries.forEach(function (entry) {
                    output += `${entry.date},${entry.time},${entry.user},${entry.group},${entry.cash},${entry.bet},${entry.pick},${entry.result}\n`
                });
            }
            Utility.download('log.csv', output);
        };
    }
    get appendRow() {
        return (entry) => {
            var row = this.elements.tbody.insertRow(this.elements.tbody.rows.length);
            row.insertCell(0).innerHTML = entry.date;
            row.insertCell(1).innerHTML = entry.time;
            row.insertCell(2).innerHTML = entry.user;
            row.insertCell(3).innerHTML = entry.group;
            row.insertCell(4).innerHTML = '$' + entry.cash;
            row.insertCell(5).innerHTML = '$' + entry.bet;
            row.insertCell(6).innerHTML = entry.pick;
            row.insertCell(7).innerHTML = entry.result;
            if (entry.pick === entry.result) {
                row.className = 'table-success';
            } else {
                row.className = 'table-danger';
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
                            <input type="text" class="form-control">
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
                                <option selected value="A">Group A</option>
                                <option value="B">Group B</option>
                                <option value="C">Group C</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"><button class="btn btn-block btn-primary" type="button">Start</button></td>
                    </tr>
                    <tr>
                        <td colspan="2"><button class="btn btn-block btn-secondary" type="button">View logs</button></td>
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
            var stats = this.getInput();
            if (stats.user === '') {
                this.addAlert('danger', 'Please enter a user id.');
                valid = false;
            } else if (!stats.user.match(/^[A-Z0-9]+$/)) {
                this.addAlert('danger', 'User id can only contain numbers and uppercase letters.');
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
    get getInput() {
        return () => {
            return {
                user: this.elements.user.value,
                cash: Number(this.elements.cash.value),
                group: this.elements.group.getSelectedValue(),
            };
        }
    }
}
class WidgetHistory extends Widget {
    constructor(parent) {
        super(parent, 'Recent Spins', `
            <table class="table table-form table-dark">
                <tbody>
                </tbody>
            </table>`);
        this.elements = {
            table: this.body.querySelectorAll('table')[0],
            tbody: this.body.querySelectorAll('tbody')[0],
        };
        this.setBodyPadding('0rem', '0rem', '0rem', '0rem');
        this.setBodyScrollHeight('714px');
    }
    get clearEntries() {
        return () => {
            var tbody = document.createElement('tbody');
            this.elements.table.replaceChild(tbody, this.elements.tbody);
            this.elements.tbody = tbody;
        }
    }
    get appendRow() {
        return (result) => {
            var row = this.elements.tbody.insertRow(this.elements.tbody.rows.length);
            var text = '#' + (row.rowIndex + 1) + ' ';
            if (result.color === 'R') {
                row.className = 'bg-danger';
                text += 'Red';
            } else if (result.color === 'B') {
                text += 'Black';
            } else if (result.color === 'G') {
                row.className = 'bg-success';
                text += 'Green';
            }
            row.insertCell(0).innerHTML = text + ' ' + result.number;
            this.cardBody.scrollTop = this.cardBody.scrollHeight;
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
                        <input type="text" class="form-control" readonly>
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
            </table>`);
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
    get spinColor() {
        return async (color) => {
            if (color === 'R') {
                var number = Utility.random(this.wheel.red);
            } else if (color === 'B') {
                var number = Utility.random(this.wheel.black);
            } else if (color === 'G') {
                var number = 0;
            } else {
                var number = Utility.random(this.wheel.order);
            }
            await this.spinTo(number);
            if (this.wheel.red.includes(number)) {
                return { color: 'R', number: number };
            } else if (this.wheel.black.includes(number)) {
                return { color: 'B', number: number };
            } else {
                return { color: 'G', number: number };
            }
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
            await Utility.sleep(200);
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
            await Utility.sleep(3200);
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
            var stats = this.getInput();
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
    get getInput() {
        return () => {
            return {
                user: this.elements.user.value,
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

        this.history = new WidgetHistory(document.getElementById('History'));
        this.history.hide();

        this.game = new WidgetGame(document.getElementById('Game'));
        this.game.elements.spin.red.onclick = this.handleSpin('R');
        this.game.elements.spin.black.onclick = this.handleSpin('B');
        this.game.hide();

        this.logs = new WidgetLog(document.getElementById('Log'));
        this.logs.elements.purgeLogs.onclick = this.logs.clearEntries;
        this.logs.elements.downloadLogs.onclick = this.logs.downloadEntries;
        this.logs.elements.viewSetup.onclick = this.viewSetup;
        this.logs.loadEntries();
        this.logs.hide();

        this.stats = {
            user: 0,
            group: 'A',
            cash: 0,
            generator: new SpinGenerator()
        };
    }
    get performSetup() {
        return () => {
            if (this.setup.validate()) {
                var input = this.setup.getInput();
                this.stats.user = input.user;
                this.stats.group = input.group;
                this.stats.cash = input.cash;
                if (input.group === 'A') {
                    this.stats.generator = new SpinGenerator('RBRBBRBR' + 'BBBBBBBB' + 'RRBRBBRB', 'R');
                } else if (input.group === 'B') {
                    this.stats.generator = new SpinGenerator('BRBRRBRB' + 'RRRRRRRR' + 'BBRBRRBR', 'B');
                } else {
                    this.stats.generator = new SpinGenerator('RBRBBRBR' + 'BRBRRBRB' + 'RRBRBBRB', 'R');
                }
                this.game.elements.user.value = input.user;
                this.game.elements.cash.value = input.cash;
                this.setup.hide();
                this.history.show();
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
    get handleSpin() {
        return (pick) => {
            return async () => {
                if (this.game.validate()) {
                    var input = this.game.getInput();
                    var result = await this.game.spinColor(this.stats.generator.next());
                    this.history.appendRow(result);
                    if (result.color === pick) {
                        this.stats.cash += input.bet;
                        this.game.addAlert('success', "You've won! Gained $" + input.bet + ".");
                    } else {
                        this.stats.cash -= input.bet;
                        this.game.addAlert('warning', 'Try again. Lost $' + input.bet + '.');
                    }
                    this.game.elements.cash.value = this.stats.cash;
                    this.logs.addEntry(this.stats.user, this.stats.group, this.stats.cash, input.bet, pick, result.color);
                }
            };
        };
    }
}
class SpinGenerator {
    constructor(results, backup) {
        this.results = results || '';
        this.backup = backup;
    }
    get next() {
        return () => {
            if (this.results.length === 0) {
                return this.backup;
            }
            var char = this.results[0];
            this.results = this.results.substr(1);
            return char;
        }
    }
}
var debug = new PageMain();