var DartGame = {};
(function() {
    DartGame.Base = function(config) {
        this._initBase(config);
    };
    DartGame.Base.prototype = {
        players: [],
        maxTurns: 0,
        currentTurn: 0,
        currentPlayer: 0,
        playerScore: {},
        gameName: 'darts',
        gridContainerId: 'scoreboard',
        typeContainerId: 'type',
        turnsContainerId: 'turns',
        dartNumber: 3,
        grid: null,
        _initBase: function(config) {
            if(config) {
                for(var key in config) {
                    this[key] = config[key];
                }
            }
        },
        addPlayer: function(name) {
            if(this.players.indexOf(name) == -1)
                return this.players.push(name) - 1;
            else
                return -1;
        },
        removePlayer: function(name) {
            var index = this.players.indexOf(name);
            if(this.players.length > 1 && index != -1) {
                this.players.splice(index, 1);
                return 1;
            }
            else
                return -1;
        },
        score: function(score) {
            this._setScore(this._convertScore(this._getScore(score)));
            this.next();
        },
        next: function() {
            var last = this.currentPlayer;
            this.currentPlayer = ++this.currentPlayer % this.players.length;
            this._highlightPlayer(last);
            if(this.currentPlayer == 0)
                this._newTurn();
        },
        start: function() {
            this._initGrid();
            this._displayGrid();
        },
        _newTurn: function() {
            this.currentTurn++;
            return this.currentTurn > this.maxTurns;
        },
        _getScore: function(score) {
            var child = score.firstChild;
            var result = [];
            var dart = 0;
            while(child) {
                if(child.nodeName == 'LI')
                    result[dart++] = { value: child.attributes['value'].nodeValue, multiplicator: child.attributes['multiplicator'].nodeValue, };
                child = child.nextSibling;
            }

            return result;
        },
        _convertScore: function(score) {
            var result = {};
            result.total = 0;
            for(var i in score)
                result.total += score[i].value * score[i].multiplicator;
            return result;
        },
        _initGrid: function() {
            this.grid = document.createElement("div");
            this.grid.innerHTML = "Hello World!";
        },
        _displayGrid: function() {
            document.getElementById(this.typeContainerId).innerHTML = this.gameName;
            document.getElementById(this.turnsContainerId).innerHTML = this.currentTurn + '/'  + this.maxTurns;
            document.getElementById(this.gridContainerId).innerHTML = "";
            document.getElementById(this.gridContainerId).appendChild(this.grid);
        },
        _setScore: function(score) {
            if(!this.playerScore[this.currentPlayer])
                this.playerScore[this.currentPlayer] = [];
            this.playerScore[this.currentPlayer][this.currentTurn] = score;
            this._setGrid(score);
        },
        _setGrid: function(score) {
            if(this.grid)
                this.grid.innerHTML += score;
        },
    };

    DartGame.X01 = function(config) {
        this._initX01(config);
    };
    DartGame.X01.prototype = {
        maxScore: 0,
        header: null,
        currentRow: null,
        _initX01: function(config) {
            if(config.maxScore)
                this.maxScore = config.maxScore;
            DartGame.Base.call(this, config);
        },
        _setGrid: function(score) {
            this.currentRow.cells[this.currentPlayer * 2].innerHTML = score.turn;
            if(score.ok == true)
                this.currentRow.cells[this.currentPlayer * 2 + 1].innerHTML = score.total;
            else
                this.currentRow.cells[this.currentPlayer * 2 + 1].innerHTML = "&mdash;";

            if(score.total == 0) {
                this.currentRow.cells[this.currentPlayer * 2].className = "win";
                this.currentRow.cells[this.currentPlayer * 2 + 1].className = "win";
            }

        },
        _initGrid: function() {
            this.grid = document.createElement("table");
            this.grid.className = "X01";


            this.header = this.grid.insertRow(-1);
            this.header.className = "header";
            this._newRow();

            for(var player in this.players) {
                var playerCell = this.header.insertCell(-1);
                playerCell.innerHTML = this.players[player];
                playerCell.colSpan = 2;

                this.currentPlayer = player;
                this._setGrid({ turn: "&mdash;", total: this.maxScore, ok: true, });
            }
            this.currentPlayer = 0;

            this._newTurn();
            this._highlightPlayer(0);
        },
        _convertScore: function(score) {
            var result = {};
            if(this.currentTurn == 1)
                result.total = this.maxScore;
            else
                result.total = this.playerScore[this.currentPlayer][this.currentTurn - 1].total;
            result.turn = 0;

            for(var i in score) {
                result.turn += score[i].value * score[i].multiplicator;
            }

            if(result.total >= result.turn) {
                result.total -= result.turn;
                result.ok = true;
            }
            else
                result.ok = false;


            return result;
        },
        _newRow: function() {
            this.currentRow = this.grid.insertRow(-1);
            for(var i = 0; i < this.players.length; i++) {
                this.currentRow.insertCell(-1);
                this.currentRow.insertCell(-1);
            }
        },
        _newTurn: function() {
            this.currentTurn++;
            document.getElementById(this.turnsContainerId).innerHTML = this.currentTurn + '/'  + this.maxTurns;
            this._newRow();
            return this.currentTurn > this.maxTurns;
        },
        _highlightPlayer: function(lastPlayer) {
            this.header.cells[lastPlayer].className = "";
            this.header.cells[this.currentPlayer].className = "current";
        },
    };
    Kinetic.Global.extend(DartGame.X01, DartGame.Base);

    DartGame.Five01 = function() {
        this._init501();
    };
    DartGame.Five01.prototype = {
        _init501: function() {
            DartGame.X01.call(this, { gameName: 'Five-O-One', maxTurns: '&infin;', maxScore: 501 });
        },
    };
    Kinetic.Global.extend(DartGame.Five01, DartGame.X01);

    DartGame.Four01= function() {
        this._init401();
    };
    DartGame.Four01.prototype = {
        _init401: function() {
            DartGame.X01.call(this, { gameName: 'Four-O-One', maxTurns: '&infin;', maxScore: 401 });
        },
    };
    Kinetic.Global.extend(DartGame.Four01, DartGame.X01);

    DartGame.Three01= function() {
        this._init301();
    };
    DartGame.Three01.prototype = {
        _init301: function() {
            DartGame.X01.call(this, { gameName: 'Three-O-One', maxTurns: '&infin;', maxScore: 301 });
        },
    };
    Kinetic.Global.extend(DartGame.Three01, DartGame.X01);

    DartGame.Cricket = function(config) {
        this._initCricket(config);
    };
    DartGame.Cricket.prototype = {
        spots: { '15': '15', '16': '16', '17': '17', '18': '18', '19': '19', '20': '20', 'D': 'double', 'T': 'triple', '25': 'center' },
        header: null,
        currentRow: null,
        totalRow: null,
        playerTotals: Array(),
        onHit: function(position, state) {
            var isScore = this.spots[String(position)];
            if(state == 0 && this.spots['D']) {
                if(!isScore || confirm("Count this as double?"))
                    return { 'value': 'D', 'multiplicator': position};
                else return null;
            }
            else if(state == 2 && this.spots['T']) {
                if(!isScore || confirm("Count this as triple?"))
                    return { 'value': 'T', 'multiplicator': position};
                else return null;
            }
            return null;
        },
        _initCricket: function(config) {
            if(!config) {
                config = {
                    gameName: 'Cricket',
                    maxTurns: 20
                }
            }
            
            DartGame.Base.call(this, config);
        },
        _setGrid: function(score) {
            for(var spot in this.spots) {
                if(score[spot]) {
                    var nbHits = score[spot];
                    if(spot == 'D' || spot == 'T')
                        nbHits = score[spot].length;
                    var selector = "td:empty.v" + this.spots[spot] + ".p" + this.currentPlayer;
                    var cell = $(selector).first();
                    while(cell.length > 0 && nbHits > 0) {
                        cell.append("&times;");
                        cell = cell.next(selector);
                        nbHits--;
                        if(spot == 'D' || spot == 'T')
                            score[spot].shift();
                    }
                    if(spot == 'D' || spot == 'T') {
                        for(var val in score[spot]) {
                            if(spot == 'D')
                                this._addTotal(2, score[spot][val]);
                            else
                                this._addTotal(3, score[spot][val]);
                        }
                    }
                    else
                        this._addTotal(nbHits, spot);
                }
                //i++;
            }
        },
        _addTotal: function(hits, value) {
            this.playerTotals[this.currentPlayer] += hits*value;
            $("tr.totals td.p" + this.currentPlayer).text(this.playerTotals[this.currentPlayer]);
        },
        _initGrid: function() {
            this.grid = document.createElement("table");
            this.grid.className = "cricket";


            this.header = this.grid.insertRow(-1);
            this.header.className = "header";

            var baseCell = this.header.insertCell(-1);
            baseCell.innerHTML = "&times;";
            baseCell.className = "base";

            for(var player in this.players) {
                var playerCell = this.header.insertCell(-1);
                playerCell.innerHTML = this.players[player];
                playerCell.colSpan = 3;
            }

            for(var spot in this.spots) {
                this._newRow(this.spots[spot]);
            }

            this.totalRow = this.grid.insertRow(-1);
            this.totalRow.className = "totals";
            var cell = this.totalRow.insertCell(-1);
            cell.innerHTML = "Scores";
            cell.className = "base";

            this.playerTotals = Array();
            for(var i = 0; i < this.players.length; i++) {
                cell = this.totalRow.insertCell(-1);
                cell.colSpan = 3;
                cell.innerHTML = '0';
                cell.className = 'p'+i;
                this.playerTotals.push(0);
            }

            this.currentTurn = 0;
            this.currentPlayer = 0;
            this._newTurn();
            this._highlightPlayer(0);
        },
        _convertScore: function(score) {
            var result = {};

            for(var i in score) {
                if(this.spots[score[i].value]) {
                    if(score[i].value != 'D' && score[i].value != 'T') {
                        if(!result[score[i].value])
                            result[score[i].value] = Number(0);
                        result[score[i].value] += Number(score[i].multiplicator);
                    }
                    else {
                        if(!result[score[i].value])
                            result[score[i].value] = Array();
                        result[score[i].value].push(Number(score[i].multiplicator));
                    }
                }
            }

            return result;
        },
        _newRow: function(value) {
            this.currentRow = this.grid.insertRow(-1);
            var cell = this.currentRow.insertCell(-1);
            cell.innerHTML = value;
            cell.className = "base " + value;

            for(var i = 0; i < this.players.length; i++) {
                this.currentRow.insertCell(-1).className = "v" + value + " p" + i;
                this.currentRow.insertCell(-1).className = "v" + value + " p" + i;
                this.currentRow.insertCell(-1).className = "v" + value + " p" + i;
            }
        },
        _newTurn: function() {
            this.currentTurn++;
            document.getElementById(this.turnsContainerId).innerHTML = this.currentTurn + '/'  + this.maxTurns;
            return this.currentTurn > this.maxTurns;
        },
        _highlightPlayer: function(lastPlayer) {
            this.header.cells[lastPlayer + 1].className = "";
            this.header.cells[this.currentPlayer + 1].className = "current";
        },
    };
    Kinetic.Global.extend(DartGame.Cricket, DartGame.Base);

})()
