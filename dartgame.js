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
            return this.players.push(name) - 1;
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
        _initCricket: function(config) {
            if(config && config.maxScore)
                this.maxScore = config.maxScore;
            DartGame.Base.call(this, config);
        },
        _setGrid: function(score) {
            var i = 0;
            console.debug(score);
            for(var spot in this.spots) {
                if(score[this.spots[spot]]) {
                    var nbCheck = score[this.spots[spot]];
                    console.debug(nbCheck);
                    if(nbCheck > 3)
                        nbCheck = 3;
                    for(var j = 1; j <= nbCheck; j++)
                        this.grid.rows[i + 1].cells[this.currentPlayer * 3 + j].innerHTML = "&times;";
                }
                i++;
            }
        },
        _initGrid: function() {
            this.grid = document.createElement("table");
            this.grid.className = "Cricket";


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

            this._newTurn();
            this._highlightPlayer(0);
        },
        _convertScore: function(score) {
            var result = {};

            for(var i in score) {
                if(this.spots[score[i].value]) {
                    if(!result[score[i].value])
                        result[score[i].value] = Number(0);
                    result[score[i].value] += Number(score[i].multiplicator);
                }
            }

            return result;
        },
        _newRow: function(value) {
            this.currentRow = this.grid.insertRow(-1);
            var cell = this.currentRow.insertCell(-1);
            cell.innerHTML = value;
            cell.className = "base";

            for(var i = 0; i < this.players.length; i++) {
                this.currentRow.insertCell(-1).className = "empty";
                this.currentRow.insertCell(-1).className = "empty";
                this.currentRow.insertCell(-1).className = "empty";
            }
        },
        _newTurn: function() {
            this.currentTurn++;
            document.getElementById(this.turnsContainerId).innerHTML = this.currentTurn + '/'  + this.maxTurns;
            return this.currentTurn > this.maxTurns;
        },
        _highlightPlayer: function(lastPlayer) {
            this.header.cells[lastPlayer].className = "";
            this.header.cells[this.currentPlayer].className = "current";
        },
    };
    Kinetic.Global.extend(DartGame.Cricket, DartGame.Base);

})()
