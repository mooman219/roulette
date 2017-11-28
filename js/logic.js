// @ts-check
"use strict";
HTMLSelectElement.prototype.getSelectedValue = function () {
    return this.options[this.selectedIndex].value;
}
class Widget {
    constructor(parent, title, body) {
        this.parent = parent;
        this.html = `
        <div class="card">
            <div class="card-header text-center">${title}</div>
            <div class="card-body">
                <div></div>
                <div>
                    ${body}
                </div>
            </div>
        </div>`;
        this.show();
    }
    get show() {
        return () => {
            this.parent.innerHTML = this.html;
            this.alerts = this.parent.querySelectorAll('div')[3];
            this.body = this.parent.querySelectorAll('div')[4];
        };
    }
    get hide() {
        return () => {
            this.parent.innerHTML = '';
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
class WidgetSetup extends Widget {
    constructor(parent) {
        super(parent, 'Setup', `
        <h4 class="card-title">Please enter your information.</h4>
        <table class="table table-form">
            <tbody>
                <tr>
                    <td><b>User ID</b></td>
                    <td><input type="number" class="form-control"></td>
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
            </tbody>
        </table>`);
        this.elements = {
            user: this.body.querySelectorAll('input')[0],
            cash: this.body.querySelectorAll('input')[1],
            group: this.body.querySelectorAll('select')[0],
            submit: this.body.querySelectorAll('button')[0]
        };
    }
    get validate() {
        return () => {
            this.clearAlerts();
            var valid = true;
            if (this.elements.user.value === '') {
                this.addAlert('danger', 'Please enter a user id.');
                valid = false;
            } else if (this.elements.user.value < 0) {
                this.addAlert('danger', 'Please enter a positive user id.');
                valid = false;
            }
            if (this.elements.cash.value === '') {
                this.addAlert('danger', 'Please enter a cash amount.');
                valid = false;
            } else if (this.elements.cash.value < 0) {
                this.addAlert('danger', 'Please enter a positive cash amount.');
                valid = false;
            }
            return valid;
        };
    }
    get getValues() {
        return () => {
            return {
                user: this.elements.user.value,
                cash: this.elements.cash.value,
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
                            <div id="toppart" class="topnodebox">
                                <div class="silvernode"></div>
                                <div class="topnode silverbg"></div>
                                <span class="top silverbg"></span>
                                <span class="right silverbg"></span>
                                <span class="down silverbg"></span>
                                <span class="left silverbg"></span>
                            </div>
                            <div id="rcircle" class="pieContainer">
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
            cash: this.body.querySelectorAll('input')[0],
            bet: this.body.querySelectorAll('input')[1],
            spin: {
                red: this.body.querySelectorAll('button')[0],
                black: this.body.querySelectorAll('button')[1]
            }
        };
    }
    get validate() {
        return () => {
            this.clearAlerts();
            var valid = true;
            if (this.elements.bet.value === '') {
                this.addAlert('danger', 'Please enter a bet.');
                valid = false;
            } else if (this.elements.bet.value < 0) {
                this.addAlert('danger', 'Please enter a positive bet.');
                valid = false;
            }
            return valid;
        };
    }
}
class PageMain {
    constructor() {
        this.setup = new WidgetSetup(document.getElementById('Setup'));
        this.game = new WidgetGame(document.getElementById('Game'));
        this.setup.elements.submit.onclick = this.performSetup;
        this.game.elements.spin.red.onclick = this.performSpinRed;
        this.game.elements.spin.black.onclick = this.performSpinBlack;
        this.stats = {
            user: 0,
            cash: 0,
            group: 0
        };
    }
    get performSetup() {
        return () => {
            if (this.setup.validate()) {
                var values = this.setup.getValues();
                this.stats = {
                    user: values.user,
                    cash: values.cash,
                    group: values.group
                };
                this.setup.hide();
            }
        };
    }
    get performSpinRed() {
        return () => {
            if (this.game.validate()) {
                randomRed();
            }
        };
    }
    get performSpinBlack() {
        return () => {
            if (this.game.validate()) {
                randomBlack();
            }
        };
    }
}
new PageMain();
