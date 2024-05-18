(function() {
    'use strict';

    var AhoCorasick = function(keywords) {
        this._buildTables(keywords);
    };

    AhoCorasick.prototype._buildTables = function(keywords) {
        var gotoFn = {
            0: {}
        };
        var output = {};

        var state = 0;
        keywords.forEach(function(word) {
            var curr = 0;
            for (var i=0; i<word.length; i++) {
                var l = word[i];
                if (gotoFn[curr] && l in gotoFn[curr]) {
                    curr = gotoFn[curr][l];
                }
                else {
                    state++;
                    gotoFn[curr][l] = state;
                    gotoFn[state] = {};
                    curr = state;
                    output[state] = [];
                }
            }

            output[curr].push(word);
        });

        var failure = {};
        var xs = [];

        // f(s) = 0 for all states of depth 1 (the ones from which the 0 state can transition to)
        for (var l in gotoFn[0]) {
            var state = gotoFn[0][l];
            failure[state] = 0;
            xs.push(state);
        }

        while (xs.length) {
            var r = xs.shift();
            // for each symbol a such that g(r, a) = s
            for (var l in gotoFn[r]) {
                var s = gotoFn[r][l];
                xs.push(s);

                // set state = f(r)
                var state = failure[r];
                while(state > 0 && !(l in gotoFn[state])) {
                    state = failure[state];
                }

                if (l in gotoFn[state]) {
                    var fs = gotoFn[state][l];
                    failure[s] = fs;
                    output[s] = output[s].concat(output[fs]);
                }
                else {
                    failure[s] = 0;
                }
            }
        }

        this.gotoFn = gotoFn;
        this.output = output;
        this.failure = failure;
    };

    AhoCorasick.prototype.search = function(string) {
        var state = 0;
    
        // Проходим по каждому символу строки
        for (var i = 0; i < string.length; i++) {
            var l = string[i];
    
            // Пока не найдено совпадение и не дошли до корневого узла
            while (state > 0 && !(l in this.gotoFn[state])) {
                // Переходим к предыдущему состоянию
                state = this.failure[state];
            }
    
            // Если символ найден в текущем состоянии
            if (l in this.gotoFn[state]) {
                // Переходим к следующему состоянию
                state = this.gotoFn[state][l];
    
                // Если найдено совпадение, возвращаем результат
                if (this.output[state].length) {
                    var foundStrs = this.output[state];
                    return [{ index: i - foundStrs[0].length + 1, words: foundStrs }]; // Запоминаем начало совпадения
                }
            }
        }
    
        return [];
    };


    if (typeof module !== 'undefined') {
        module.exports = AhoCorasick;
    }
    else {
        window.AhoCorasick = AhoCorasick;
    }
})();
