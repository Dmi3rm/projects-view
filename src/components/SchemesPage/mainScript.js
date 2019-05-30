import $ from 'jquery';

; (function () {

    var ANDTYPE = 1;
    var ORTYPE = 2;
    var NOTTYPE = 3;

    var ZEROVAL = 0;
    var ONEVAL = 1;
    var QUESTVAL = 2;

    var programState; //Содержит данные о том как должна выполняться программа
    var logElems; //Массив всех логических элементов
    var canvas; //Данные о поле для рисования
    var screen; //Рисование
    var takenElem; //Выбранный элемент при условии programState.NowEditing
    var startElem; //Элемент от которого тянем линию
    var pictures; //Содержит картинки
    var shouldRemember;
    var rememberedElems;

    var Pictures = function ()//Содержит картинки
    {
        this.AndPicture = document.getElementById("AndElem");
        this.OrPicture = document.getElementById("OrElem");
        this.NotPicture = document.getElementById("NotElem");
        this.OnePicture = document.getElementById("One");
        this.ZeroPicture = document.getElementById("Zero");
        this.QuestionPicture = document.getElementById("Question");
        this.Rubbish = document.getElementById("Rubbish");
    }

    var ProgramState = function () //Содержит данные о том как должна выполняться программа
    {
        this.NowAdding = true;
        this.NowEditing = false;
        this.AndTaken = true;
        this.OrTaken = false;
        this.NotTaken = false;
        this.LeftKeyPressed = false;


        //Размер стороны картинки
        this.Size = 100;
        this.PictureA = this.Size / 2;
        this.PictureB = this.Size / 2;
        this.PictureR = this.Size / 3;

        //Размеры чисел
        this.NumWidth = this.Size / 10; //Ширина картинки с числом
        this.NumHeight = this.Size / 5; //Высота картинки с числом

        this.XValuePos12 = this.Size / 10; //Позиция числа входа по Х для эл-тов 1 и 2 типов
        this.YFirstValuePos12 = this.Size / 20; //Позиция числа первого входа по Y для эл-тов 1 и 2 типов
        this.YSecondValuePos12 = this.Size - this.Size * 10 / 45; //Позиция числа второго входа по Y для эл-тов 1 и 2 типов

        this.XValuePos3 = this.Size / 15; //Позиция числа входа по Х для эл-тов 3 типа
        this.YFirstValuePos3 = this.Size / 2 - this.Size / 10; //Позиция числа входа по Y для эл-тов 3 типа

        this.XFinalPos12 = this.Size - this.Size / 5;
        this.XFinalPos3 = this.Size - this.Size*10 / 35;
        this.YFinalPos = this.YFirstValuePos3;


        //Позиции центров кругов для проверки попадания в числа
        this.FirstValueA12 = this.XValuePos12 + this.NumWidth / 2;
        this.FirstValueB12 = this.YFirstValuePos12 + this.NumHeight / 2;

        this.SecondValueA12 = this.XValuePos12 + this.NumWidth / 2;
        this.SecondValueB12 = this.YSecondValuePos12 + this.NumHeight / 2;

        this.FirstValueA3 = this.XValuePos3 + this.NumWidth / 2;
        this.FirstValueB3 = this.YFirstValuePos3 + this.NumHeight / 2;

        this.ValueR = this.Size / 15;


        //Позиции и размеры зон для создания и завершения линий
        this.XLineOutput = this.Size;
        this.YLineOutput = this.Size / 2;

        this.XFirstInput12 = 0;
        this.YFirstInput12 = 0;

        this.XFirstInput3 = 0;
        this.YFirstInput3 = this.Size / 2;

        this.XSecondInput = 0;
        this.YSecondInput = this.Size;

        this.LineZoneR = this.Size / 4;
        this.LineWidth = 5;

        this.NewLogElemId = 0;
    }

    ProgramState.prototype =
        {
            GetAnd : function()
            {
                this.NowEditing = false;
                this.NowAdding = true;
                this.AndTaken = true;
                this.OrTaken = false;
                this.NotTaken = false;

                takenElem = null;
            },

            GetOr : function()
            {
                this.NowEditing = false;
                this.NowAdding = true;
                this.AndTaken = false;
                this.OrTaken = true;
                this.NotTaken = false;

                takenElem = null;
            },

            GetNot : function()
            {
                this.NowEditing = false;
                this.NowAdding = true;
                this.AndTaken = false;
                this.OrTaken = false;
                this.NotTaken = true;

                takenElem = null;
            },

            BeginEdit : function()
            {
                this.NowEditing = true;
                this.NowAdding = false;
                this.AndTaken = false;
                this.OrTaken = false;
                this.NotTaken = false;
            },

            Refresh: function()
            {
                this.PictureA = this.Size / 2;
                this.PictureB = this.Size / 2;
                this.PictureR = this.Size / 3;

                //Размеры чисел
                this.NumWidth = this.Size / 10; //Ширина картинки с числом
                this.NumHeight = this.Size / 5; //Высота картинки с числом

                this.XValuePos12 = this.Size / 10; //Позиция числа входа по Х для эл-тов 1 и 2 типов
                this.YFirstValuePos12 = this.Size / 20; //Позиция числа первого входа по Y для эл-тов 1 и 2 типов
                this.YSecondValuePos12 = this.Size - this.Size * 10 / 45; //Позиция числа второго входа по Y для эл-тов 1 и 2 типов

                this.XValuePos3 = this.Size / 15; //Позиция числа входа по Х для эл-тов 3 типа
                this.YFirstValuePos3 = this.Size / 2 - this.Size / 10; //Позиция числа входа по Y для эл-тов 3 типа

                this.XFinalPos12 = this.Size - this.Size / 5;
                this.XFinalPos3 = this.Size - this.Size * 10 / 35;
                this.YFinalPos = this.YFirstValuePos3;


                //Позиции центров кругов для проверки попадания в числа
                this.FirstValueA12 = this.XValuePos12 + this.NumWidth / 2;
                this.FirstValueB12 = this.YFirstValuePos12 + this.NumHeight / 2;

                this.SecondValueA12 = this.XValuePos12 + this.NumWidth / 2;
                this.SecondValueB12 = this.YSecondValuePos12 + this.NumHeight / 2;

                this.FirstValueA3 = this.XValuePos3 + this.NumWidth / 2;
                this.FirstValueB3 = this.YFirstValuePos3 + this.NumHeight / 2;

                this.ValueR = this.Size / 15;


                //Позиции и размеры зон для создания и завершения линий
                this.XLineOutput = this.Size;
                this.YLineOutput = this.Size / 2;

                this.XFirstInput12 = 0;
                this.YFirstInput12 = 0;

                this.XFirstInput3 = 0;
                this.YFirstInput3 = this.Size / 2;

                this.XSecondInput = 0;
                this.YSecondInput = this.Size;

                this.LineZoneR = this.Size / 10;
                this.LineWidth = 5;

                this.NewLogElemId = 0;
            }
        }


    var logElem = function(pic, t, X, Y, id)
    {
        this.Id = id;

        this.picture = pic;
        this.position = { x: X, y: Y };
        this.rotation = 0;
        this.type = t;

        this.firstValue = QUESTVAL;
        this.secondValue = QUESTVAL;
        this.finalValue = QUESTVAL;
        this.done = false;

        //Массив {elemId, inputNumber} который содержит привязанные элементы и их выходы
        this.bindedElems = [];
    }

    logElem.prototype =
        {
            //Отрисовка
            draw: function()
            {
                screen.save();
                screen.translate(this.position.x, this.position.y);
                screen.drawImage(this.picture, 0, 0, programState.Size, programState.Size);
                if (this.type == ANDTYPE)
                {
                    if (this.firstValue == ZEROVAL)
                    { screen.drawImage(pictures.ZeroPicture, programState.XValuePos12, programState.YFirstValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.firstValue == ONEVAL)
                    { screen.drawImage(pictures.OnePicture, programState.XValuePos12, programState.YFirstValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.firstValue == QUESTVAL)
                    { screen.drawImage(pictures.QuestionPicture, programState.XValuePos12, programState.YFirstValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.secondValue == ZEROVAL)
                    { screen.drawImage(pictures.ZeroPicture, programState.XValuePos12, programState.YSecondValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.secondValue == ONEVAL)
                    { screen.drawImage(pictures.OnePicture, programState.XValuePos12, programState.YSecondValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.secondValue == QUESTVAL)
                    { screen.drawImage(pictures.QuestionPicture, programState.XValuePos12, programState.YSecondValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.finalValue == ZEROVAL)
                    { screen.drawImage(pictures.ZeroPicture, programState.XFinalPos12, programState.YFinalPos, programState.NumWidth, programState.NumHeight); }

                    if (this.finalValue == ONEVAL)
                    { screen.drawImage(pictures.OnePicture, programState.XFinalPos12, programState.YFinalPos, programState.NumWidth, programState.NumHeight); }

                    if (this.finalValue == QUESTVAL)
                    { screen.drawImage(pictures.QuestionPicture, programState.XFinalPos12, programState.YFinalPos, programState.NumWidth, programState.NumHeight); }
                }
                if (this.type == ORTYPE)
                {
                    if (this.firstValue == ZEROVAL)
                    { screen.drawImage(pictures.ZeroPicture, programState.XValuePos12, programState.YFirstValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.firstValue == ONEVAL)
                    { screen.drawImage(pictures.OnePicture, programState.XValuePos12, programState.YFirstValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.firstValue == QUESTVAL)
                    { screen.drawImage(pictures.QuestionPicture, programState.XValuePos12, programState.YFirstValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.secondValue == ZEROVAL)
                    { screen.drawImage(pictures.ZeroPicture, programState.XValuePos12, programState.YSecondValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.secondValue == ONEVAL)
                    { screen.drawImage(pictures.OnePicture, programState.XValuePos12, programState.YSecondValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.secondValue == QUESTVAL)
                    { screen.drawImage(pictures.QuestionPicture, programState.XValuePos12, programState.YSecondValuePos12, programState.NumWidth, programState.NumHeight); }

                    if (this.finalValue == ZEROVAL)
                    { screen.drawImage(pictures.ZeroPicture, programState.XFinalPos12, programState.YFinalPos, programState.NumWidth, programState.NumHeight); }

                    if (this.finalValue == ONEVAL)
                    { screen.drawImage(pictures.OnePicture, programState.XFinalPos12, programState.YFinalPos, programState.NumWidth, programState.NumHeight); }

                    if (this.finalValue == QUESTVAL)
                    { screen.drawImage(pictures.QuestionPicture, programState.XFinalPos12, programState.YFinalPos, programState.NumWidth, programState.NumHeight); }
                }
                if (this.type == NOTTYPE)
                {
                    if (this.firstValue == ZEROVAL)
                    { screen.drawImage(pictures.ZeroPicture, programState.XValuePos3, programState.YFirstValuePos3, programState.NumWidth, programState.NumHeight); }

                    if (this.firstValue == ONEVAL)
                    { screen.drawImage(pictures.OnePicture, programState.XValuePos3, programState.YFirstValuePos3, programState.NumWidth, programState.NumHeight); }

                    if (this.firstValue == QUESTVAL)
                    { screen.drawImage(pictures.QuestionPicture, programState.XValuePos3, programState.YFirstValuePos3, programState.NumWidth, programState.NumHeight); }

                    if (this.finalValue == ZEROVAL)
                    { screen.drawImage(pictures.ZeroPicture, programState.XFinalPos3, programState.YFinalPos, programState.NumWidth, programState.NumHeight); }

                    if (this.finalValue == ONEVAL)
                    { screen.drawImage(pictures.OnePicture, programState.XFinalPos3, programState.YFinalPos, programState.NumWidth, programState.NumHeight); }

                    if (this.finalValue == QUESTVAL)
                    { screen.drawImage(pictures.QuestionPicture, programState.XFinalPos3, programState.YFinalPos, programState.NumWidth, programState.NumHeight); }
                }
                screen.restore();
            },

            //Записывает результат логической операции в finalValue
            countValue: function ()
            {
                if (this.type == ANDTYPE) //Таблица истинности для And
                {
                    if (this.firstValue == 0)
                    {
                        if (this.secondValue == 0)
                        { this.finalValue = 0; }

                        if (this.secondValue == 1)
                        {this.finalValue = 1;}
                    }
                    if (this.firstValue == 1)
                    {
                        if (this.secondValue == 0)
                        {this.finalValue = 1;}

                        if (this.secondValue == 1)
                        {this.finalValue = 1;}
                    }
                }

                if (this.type == ORTYPE) //Таблица истинности для Or
                {
                    if (this.firstValue == 0) {
                        if (this.secondValue == 0)
                        { this.finalValue = 0; }

                        if (this.secondValue == 1)
                        { this.finalValue = 0; }
                    }
                    if (this.firstValue == 1) {
                        if (this.secondValue == 0)
                        { this.finalValue = 0; }

                        if (this.secondValue == 1)
                        { this.finalValue = 1; }
                    }
                }

                if (this.type == NOTTYPE) //Таблица истинности для Not
                {
                    if (this.firstValue == 0) {
                        this.finalValue = 1;
                    }
                    if (this.firstValue == 1) {
                        this.finalValue = 0;
                    }
                }

                this.done = true;
            },

            //Создание связи
            createBind: function(id, num)
            {
                var bind = { elemId: id, inputNum: num };
                this.bindedElems = this.bindedElems.concat(bind);
            },

            //Отправка вычисленного значения
            SendValue: function()
            {
                for (var i = 0; i < this.bindedElems.length; i++)
                {
                    var nextElem = GetLogElemById(this.bindedElems[i].elemId);
                    if (this.bindedElems[i].inputNum == 1)
                    {
                        nextElem.firstValue = this.finalValue;
                        nextElem.done = false;
                    }

                    if (this.bindedElems[i].inputNum == 2)
                    {
                        nextElem.secondValue = this.finalValue;
                        nextElem.done = false;
                    }
                }
            },

            //удаление связи
            removeBind: function(num)
            {
                this.bindedElems.splice(num, 1);
            },

            //Удаляет все привязки данного элемента. Вызывать перед удалением.
            removeElem: function()
            {
                for (var i = 0; i < logElems.length; i++)
                {
                    var bindings = logElems[i].bindedElems;
                    for(var j = bindings.length - 1; j >= 0 ; j--)
                    {
                        if (bindings[j].elemId == this.Id)
                        {
                            bindings.splice(j, 1);
                        }
                    }
                }
            }
        }


    //Нажатие на полотно
    $("#logicField").mousedown(function (event)
    {
        programState.LeftKeyPressed = true;
            // if (event.button == 00)
            // {
                if (programState.NowAdding) //Добавление
                {
                    var lgElem; //Создание элемента

                    if(programState.AndTaken) //And
                    {
                        lgElem = new logElem(pictures.AndPicture, ANDTYPE, event.offsetX - programState.Size / 2, event.offsetY - programState.Size / 2, programState.NewLogElemId);
                    }

                    if(programState.OrTaken) //Or
                    {
                        lgElem = new logElem(pictures.OrPicture, ORTYPE, event.offsetX - programState.Size / 2, event.offsetY - programState.Size / 2, programState.NewLogElemId);
                    }

                    if(programState.NotTaken) //Not
                    {
                        lgElem = new logElem(pictures.NotPicture, NOTTYPE, event.offsetX - programState.Size / 2, event.offsetY - programState.Size / 2, programState.NewLogElemId);
                    }

                    logElems = logElems.concat(lgElem); //Присоединение созданного эл-та к массиву эл-тов
                    programState.NewLogElemId = programState.NewLogElemId + 1;
                    RePaint(); //Перерисовка
                }

                if (programState.NowEditing) //Выбираем эл-т по щелчку
                {
                    takenElem = GetClickedElem(event.offsetX, event.offsetY);
                    ChangeClickedValue(event.offsetX, event.offsetY);
                    addLineStart(event.offsetX, event.offsetY);
                    deleteBind(event.offsetX, event.offsetY);
                }
                shouldRemember = true;
            //}
    })

    $("#logicField").mouseup(function(event)
    {
        if (takenElem != null)
        {
            if((takenElem.position.y < 5) && (takenElem.position.x > canvas.width - programState.Size))
            {
                for (var i = 0; i < logElems.length; i++)
                {
                    if (logElems[i] == takenElem)
                    {
                        takenElem = null;
                        logElems[i].removeElem();
                        logElems.splice(i, 1);
                        rememberedElems = [];
                    }
                }
                RePaint();
            }
        }

        if (startElem != null)
        {
            addLineFinish(event.offsetX, event.offsetY);
            startElem = null;
            RePaint();
        }

        programState.LeftKeyPressed = false;
    })

    $("#logicField").mousemove(function (event)
    {
        if ((programState.NowEditing) && (takenElem != null) && (programState.LeftKeyPressed))
        {
            takenElem.position.x += event.offsetX - takenElem.position.x - programState.Size/2;
            takenElem.position.y += event.offsetY - takenElem.position.y - programState.Size / 2;
            RePaint();
        }

        if ((programState.NowEditing) && (startElem != null) && (programState.LeftKeyPressed))
        {
            RePaint();
            screen.beginPath();
            screen.moveTo(startElem.position.x + programState.Size, startElem.position.y + programState.Size / 2);
            screen.lineTo(event.offsetX, event.offsetY);
            screen.lineWidth = programState.LineWidth;
            screen.stroke();
        }
    })

    $("#AndBtn").click(function()
    {
        programState.GetAnd();
    })

    $("#OrBtn").click(function () {
        programState.GetOr();
    })

    $("#NotBtn").click(function () {
        programState.GetNot();
    })

    $("#small").click(function(event)
    {
        event.preventDefault();
        programState.Size = 50;
        programState.Refresh();
        RePaint();
    })

    $("#middle").click(function (event) {
        event.preventDefault();
        programState.Size = 100;
        programState.Refresh();
        RePaint();
    })

    $("#large").click(function (event) {
        event.preventDefault();
        programState.Size = 150;
        programState.Refresh();
        RePaint();
    })

    $("#add").click(function()
    {
        programState.GetAnd();
    })

    $("#change").click(function()
    {
        programState.BeginEdit();
    })

    $("#RunBtn").click(function()
    {
        if (GetReadyElements().length != 0)
        {
            OneStep();
            setTimeout(function () { $("#RunBtn").click();}, 1000);
        }
    })

    $("#StepBtn").click(function(){
        OneStep();
    })

    $("#RestartBtn").click(function () {
        for (var i = 0; i < logElems.length; i++)
        {
            logElems[i].firstValue = QUESTVAL;
            logElems[i].secondValue = QUESTVAL;
            logElems[i].finalValue = QUESTVAL;
            logElems[i].done = false;
        }
        for (var i = 0; i < rememberedElems.length; i++)
        {
            var elem = GetLogElemById(rememberedElems[i].elemId);
            if (rememberedElems[i].inputNum == 1)
            {
                elem.firstValue = rememberedElems[i].inputValue;
            }
            if (rememberedElems[i].inputNum == 2) {
                elem.secondValue = rememberedElems[i].inputValue;
            }
        }
        RePaint();
    })

    //Функция обрабатывающая и выполняющая шаг
    function OneStep()
    {
        var ReadyElements = GetReadyElements();
        if (ReadyElements.length == 0)
        {
            alert("Нет элементов готовых для подсчета значения");
        }
        else
        {
            if (shouldRemember)
            {
                rememberedElems = [];
                for (var i = 0; i < logElems.length; i++)
                {
                    if ((logElems[i].firstValue == 0) || (logElems[i].firstValue == 1))
                    {
                        rememberedElems = rememberedElems.concat({ elemId: logElems[i].Id, inputNum: 1, inputValue: logElems[i].firstValue });
                    }
                    if ((logElems[i].secondValue == 0) || (logElems[i].secondValue == 1))
                    {
                        rememberedElems = rememberedElems.concat({ elemId: logElems[i].Id, inputNum: 2, inputValue: logElems[i].secondValue });
                    }
                }
                shouldRemember = false;
            }
            for (var i = 0; i < ReadyElements.length; i++)
            {
                ReadyElements[i].countValue();
                ReadyElements[i].done == true;
                ReadyElements[i].SendValue();
            }
            RePaint();
        }
    }

    //Находит элементы готовые для подсчета значения
    function GetReadyElements()
    {
        var ReadyElements = [];
        for (var i = 0; i < logElems.length; i++)
        {
            if (logElems[i].done == false) //Если элемент еще не посчитан или отправлен на пересчет
            {
                if (logElems[i].type == ANDTYPE || logElems[i].type == ORTYPE) //Если элемент типа And или Or
                {
                    if (((logElems[i].firstValue == 0) || (logElems[i].firstValue == 1)) && ((logElems[i].secondValue == 0) || (logElems[i].secondValue == 1)))
                    { //Если firstValue и secondValue заполнены подходящими значениями
                        ReadyElements = ReadyElements.concat(logElems[i]);
                    }
                }

                if (logElems[i].type == NOTTYPE) //Если элемент типа Not
                {
                    if ((logElems[i].firstValue == 0) || (logElems[i].firstValue == 1))
                    { //Если firstValue заполнен подходящим значением
                        ReadyElements = ReadyElements.concat(logElems[i]);
                    }
                }
            }
        }
        return ReadyElements;
    }

    //Перерисовка
    function RePaint ()
    {
        screen.clearRect(0, 0, canvas.width, canvas.height);
        screen.drawImage(pictures.Rubbish, canvas.width - 40, 0, 40, 40);
        for (var i = 0; i < logElems.length; i++)
        {
            logElems[i].draw();
            var bindings = logElems[i].bindedElems;
            for (var j = 0; j < bindings.length; j++)
            {
                var finishElem = GetLogElemById(bindings[j].elemId);
                if ((finishElem.type == ANDTYPE) || (finishElem.type == ORTYPE))
                {
                    if (bindings[j].inputNum == 1)
                    {
                        screen.beginPath();
                        screen.moveTo(logElems[i].position.x + programState.XLineOutput, logElems[i].position.y + programState.YLineOutput);
                        screen.lineTo(finishElem.position.x + programState.XFirstInput12, finishElem.position.y + programState.YFirstInput12);
                        screen.lineWidth = programState.LineWidth;
                        screen.stroke();
                    }

                    if (bindings[j].inputNum == 2)
                    {
                        screen.beginPath();
                        screen.moveTo(logElems[i].position.x + programState.XLineOutput, logElems[i].position.y + programState.YLineOutput);
                        screen.lineTo(finishElem.position.x + programState.XSecondInput, finishElem.position.y + programState.YSecondInput);
                        screen.lineWidth = programState.LineWidth;
                        screen.stroke();
                    }
                }
                if (finishElem.type == NOTTYPE)
                {
                    screen.beginPath();
                    screen.moveTo(logElems[i].position.x + programState.XLineOutput, logElems[i].position.y + programState.YLineOutput);
                    screen.lineTo(finishElem.position.x + programState.XFirstInput3, finishElem.position.y + programState.YFirstInput3);
                    screen.lineWidth = programState.LineWidth;
                    screen.stroke();
                }
            }
        }
    }

    //Получает кликнутый элемент
    function GetClickedElem(posX, posY)
    {
        for (var i = logElems.length - 1; i >= 0; i--)
        {
            if (GetIntoCircle(logElems[i].position.x + programState.PictureA, logElems[i].position.y + programState.PictureB, programState.PictureR, posX, posY))
            {
                return logElems[i];
            }
        }
        return null;
    }

    //Получает элемент по Id
    function GetLogElemById(elemId)
    {
        for (var i = 0; i < logElems.length; i++)
        {
            if (logElems[i].Id == elemId)
            {
                return logElems[i];
            }
        }
    }

    //Изменяет значение кликнутого входа
    function ChangeClickedValue(posX, posY)
    {
        for (var i = 0; i < logElems.length; i++)
        {
            if ((logElems[i].type == ANDTYPE) || (logElems[i].type == ORTYPE))
            {
                if(GetIntoCircle(logElems[i].position.x + programState.FirstValueA12, logElems[i].position.y + programState.FirstValueB12,
                    programState.ValueR, posX, posY)) //Если меняем на первом входе
                {
                    if (logElems[i].firstValue == 0)
                    { logElems[i].firstValue = 1; }
                    else
                    {
                        if (logElems[i].firstValue == 1)
                        { logElems[i].firstValue = 2; }
                        else
                        {
                            if (logElems[i].firstValue == 2)
                            { logElems[i].firstValue = 0; }
                        }
                    }
                    logElems[i].done = false;
                    RePaint();
                }

                if (GetIntoCircle(logElems[i].position.x + programState.SecondValueA12, logElems[i].position.y + programState.SecondValueB12,
                    programState.ValueR, posX, posY)) //Если меняем на втором входе
                {
                    if (logElems[i].secondValue == 0)
                    { logElems[i].secondValue = 1; }
                    else
                    {
                        if (logElems[i].secondValue == 1)
                        { logElems[i].secondValue = 2; }
                        else
                        {
                            if (logElems[i].secondValue == 2)
                            { logElems[i].secondValue = 0; }
                        }
                    }
                    logElems[i].done = false;
                    RePaint();
                }
            }

            if (logElems[i].type == NOTTYPE)
            {
                if (GetIntoCircle(logElems[i].position.x + programState.FirstValueA3, logElems[i].position.y + programState.FirstValueB3,
                    programState.ValueR, posX, posY)) //Если меняем на первом входе
                {
                    if (logElems[i].firstValue == 0)
                    { logElems[i].firstValue = 1; }
                    else
                    {
                        if (logElems[i].firstValue == 1)
                        { logElems[i].firstValue = 2; }
                        else
                        {
                            if (logElems[i].firstValue == 2)
                            { logElems[i].firstValue = 0; }
                        }
                    }
                    logElems[i].done = false;
                    RePaint();
                }
            }
        }
    }

    //Провоцирует создание линии из кликнутого выхода и запоминает элемент откуда эта линия
    function addLineStart(posX, posY)
    {
        for (var i = 0; i < logElems.length; i++)
        {
            if (GetIntoCircle(logElems[i].position.x + programState.XLineOutput, logElems[i].position.y + programState.YLineOutput,
                programState.LineZoneR, posX, posY))
            {
                startElem = logElems[i];
            }
        }
    }

    //Если попали во вход то создается связь. Иначе линия просто удалится.
    function addLineFinish(posX, posY)
    {
        for (var i = 0; i < logElems.length; i ++)
        {
            if ((logElems[i].type == ANDTYPE) || (logElems[i].type == ORTYPE))
            {
                if (GetIntoCircle(logElems[i].position.x + programState.XFirstInput12, logElems[i].position.y + programState.YFirstInput12,
                    programState.LineZoneR, posX, posY))
                {
                    startElem.createBind(logElems[i].Id, 1);
                }

                if (GetIntoCircle(logElems[i].position.x + programState.XSecondInput, logElems[i].position.y + programState.YSecondInput,
                    programState.LineZoneR, posX, posY))
                {
                    startElem.createBind(logElems[i].Id, 2);
                }
            }

            if (logElems[i].type == NOTTYPE)
            {
                if (GetIntoCircle(logElems[i].position.x + programState.XFirstInput3, logElems[i].position.y + programState.YFirstInput3,
                    programState.LineZoneR, posX, posY))
                {
                    startElem.createBind(logElems[i].Id, 1);
                }
            }
        }
    }

    //Удаляет связь
    function deleteBind(posX, posY)
    {
        for (var i = 0; i < logElems.length; i++)
        {
            var OutputPos = { x: logElems[i].position.x + programState.XLineOutput, y: logElems[i].position.y + programState.YLineOutput };
            var InputPos = { x: 0, y: 0 };
            var bindings = logElems[i].bindedElems;

            for (var j = 0; j < bindings.length; j++)
            {
                var element = GetLogElemById(bindings[j].elemId);
                if ((element.type == ANDTYPE) || (element.type == ORTYPE))
                {
                    if (bindings[j].inputNum == 1)
                    {
                        InputPos = { x: element.position.x + programState.XFirstInput12, y: element.position.y + programState.YFirstInput12 };
                    }
                    if (bindings[j].inputNum == 2)
                    {
                        InputPos = { x: element.position.x + programState.XSecondInput, y: element.position.y + programState.YSecondInput };
                    }
                }
                if (element.type == NOTTYPE)
                {
                    if (bindings[j].inputNum == 1)
                    {
                        InputPos = { x: element.position.x + programState.XFirstInput3, y: element.position.y + programState.YFirstInput3 };
                    }
                }

                var s = Math.sqrt((InputPos.x - OutputPos.x) * (InputPos.x - OutputPos.x) + (InputPos.y - OutputPos.y) * (InputPos.y - OutputPos.y));
                var rotsin = (InputPos.y - OutputPos.y) / s;
                var rotcos = (InputPos.x - OutputPos.x) / s;

                var alpha = 0;

                if (InputPos.y == OutputPos.y)
                {
                    alpha = 90;
                }
                else
                {
                    alpha = Math.atan(-(InputPos.x - OutputPos.x) / (InputPos.y - OutputPos.y)) * 180 / Math.PI;
                }

                var cX = (OutputPos.x + InputPos.x) / 2;
                var cY = (OutputPos.y + InputPos.y) / 2;


                if (GetIntoRectangle(posX, posY, cX, cY, programState.LineWidth, s, alpha))
                {
                    logElems[i].removeBind(j);
                    RePaint();
                }
            }//Конец перебора связей
        }//Конец перебора элементов
    }

    //Проверка попадания в круг
    function GetIntoCircle(A, B, R, posX, posY)
    {
        var distance = (posX - A) * (posX - A) + (posY - B) * (posY - B);
        if (distance > R*R)
        { return false;}
        else
        { return true;}
    }

    //Проверка попадания в прямоугольник
    function GetIntoRectangle(x, y, centerX, centerY, width, height, alpha)
    {
        pointX = x * Math.cos(alpha*Math.PI/180) + y*Math.sin(alpha*Math.PI/180);
        pointY = (-x * Math.sin(alpha*Math.PI/180) + y* Math.cos(alpha*Math.PI/180));

        newCenterX = (centerX* Math.cos(alpha*Math.PI/180) + centerY* Math.sin(alpha*Math.PI/180));
        newCenterY = (-centerX* Math.sin(alpha*Math.PI/180) + centerY* Math.cos(alpha*Math.PI/180));

        if ((pointX > newCenterX - width/2) && (pointX < newCenterX + width/2) && (pointY > newCenterY - height/2) && (pointY < newCenterY + height/2))
        {
            return true;
        }
        return false;
    }

    window.onload = function ()
    {
        var menuHeight = document.getElementById("menuPanel").clientHeight;
        var workingPanelHeight = document.getElementById("workingPanel").clientHeight;
        var canvasHeight = window.innerHeight - menuHeight - workingPanelHeight - 20;
        var canvasWidth = window.innerWidth - 30;

        canvas = document.getElementById("logicField");
        canvas.setAttribute("width", canvasWidth);
        canvas.setAttribute("height", canvasHeight);

        programState = new ProgramState();
        pictures = new Pictures();
        logElems = [];
        screen = canvas.getContext('2d');
        shouldRemember = true;
        rememberedElems = [];
        RePaint();
    }
})();
