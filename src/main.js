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
