(function (){

    const ticTacToe = {
    
        init: function(){
            this.cacheDom()
            this.setFieldIndex()
            this.setMode()
            this.startBtn.addEventListener('click', this.gameStart)
        },
        data : {
            winCombs : [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ],
            turn: 'playerOne',
            move: 0,
            round:0,
            win:false,
            start:true,
            difficultyAi2:0,
            difficultyAi1:0,
            playMode: 'humanOnly'
        },
        cacheDom : function(){
            this.fields = document.querySelectorAll('.field')
            this.playerNames = document.querySelectorAll('.playerName')
            this.modi = document.querySelectorAll('.mode')
            this.aiTwo = document.querySelector('#ai2')
            this.startBtn = document.querySelector('#start')
            this.playerInfo = document.querySelectorAll('.playerInfo')
            this.WinsOne = document.querySelector('#playerOneWins')
            this.WinsTwo = document.querySelector('#playerTwoWins')
            this.NameOne = document.querySelector('#playerOneName')
            this.NameTwo = document.querySelector('#playerTwoName')
            this.difficultyAi2 = document.querySelector('#diffAi2')
            this.difficultyAi1 = document.querySelector('#diffAi1')
            this.endless = document.querySelector('#endless')
            this.blueBar = document.querySelector('.blueBar')
            this.greenBar = document.querySelector('.greenBar')
            this.bar = document.querySelector('.bar')
            this.drawBar=document.querySelector('.drawBar')

        },

        //erstellt Spieler Object
        createPlayer : function(playerNames){
            playerNames.forEach(player =>{
                
                const name = player.value
                const marker = player.id === 'playerOne' ? 'X' : 'O'
                const picks = []
                const points = 0
                this.data[player.id] = {name,marker,picks,points}
            })
    
        },
        //legt den spielModus fest
        setMode: function(){



                ticTacToe.modi.forEach(mode => {

                    mode.addEventListener('click', (e) => {
                        
                        const playMode = e.target.id
                        
                        //legt den SpielerNamen fest
                        ticTacToe.playerNames.forEach(input => {
                            input.value = ''

                            if(playMode === 'humanVsAi'){
                               input.value = input.id === 'playerOne' ? 
                                                          'playerOne' : 'SkyNet'
                            }else if(playMode === 'aiVsAi'){
                                input.value = input.id === 'playerOne' ? 
                                                           'Hal 9000'  : 'SkyNet'
                            }else{
                                input.value = input.id === 'playerOne' ? 
                                                           'playerOne'  : 'playerTwo'
                            }
                        })
                        ticTacToe.data.playMode = playMode
                    })
                })

            },


        gameStart : function(){
            
            const restart = ticTacToe.startBtn.textContent === 'Restart'

            if(restart){
                ticTacToe.reset()
                ticTacToe.data.round = 0
            }
            
            const playMode = ticTacToe.data.playMode
            
            
            ticTacToe.createPlayer(ticTacToe.playerNames)
            ticTacToe.displayPlayerStats()


            ticTacToe.data.difficultyAi2 = ticTacToe.difficultyAi2.value  
            ticTacToe.data.difficultyAi1 = ticTacToe.difficultyAi1.value
            
            if(playMode === 'humanVsAi' || playMode === 'humanOnly'){
                ticTacToe.data.listener =[]
                ticTacToe.bindEvent()
            }else{
                ticTacToe.round()
            }
            
            ticTacToe.startBtn.textContent = 'Restart'


        },

        //bindet das event ans jeweilige Feld
        bindEvent : function(){

            this.fields.forEach((field,index) => {


                //ertellt event und sammelt es, um es später wieder
                //entfernen zu können
                const event = function(){
                    return ticTacToe.round
                }()
                this.data.listener.push(event)

                field.addEventListener('click',event)
            })
            
            
        },

        //fügt den Feldern einen index hinzu
        setFieldIndex : function(){
            this.fields.forEach((field,index) => {
                
                field.setAttribute('num', index)

            } )
        },

        displayPlayerStats : function (){
            ticTacToe.NameOne.textContent = ticTacToe.data.playerOne.name
            ticTacToe.NameTwo.textContent = ticTacToe.data.playerTwo.name
            ticTacToe.WinsTwo.textContent = 'Wins: 0';
            ticTacToe.WinsOne.textContent = 'Wins: 0';

        },
        //entfernt listener
        removeListener: function(field){
            
            const index = field.getAttribute('num')
            field.removeEventListener('click', this.data.listener[index])
            
        },
        //startet eine Runde
        round : function(e){

            const playMode = ticTacToe.data.playMode
            let win = ticTacToe.data.win
            let move = 0
            
            
            // wenn mindestens ein User spielt.
            if(playMode === 'humanVsAi' || playMode === 'humanOnly'){
                const player = ticTacToe.playerTurn();
                const field = (e.target || null)
                const pick = +field.getAttribute('num')
                const playerPicks = ticTacToe.data[player].picks
                
                move = ticTacToe.data.move
                ticTacToe.data.start = false;
                playerPicks.push(pick)
                win = ticTacToe.checkWin(player)
                ticTacToe.render(player,field)
                ticTacToe.removeListener(field)
                
                if(win || move === 9){
                    return ticTacToe.gameEnd(player,win)
                }
            }


            // wenn midnestens ein Ki spielt
            if(playMode !== 'humanOnly' && !win && move <9){

                    const time = playMode === 'aiVsAi' ? 500 : 300

                    setTimeout(function(){
                        ticTacToe.ticTacToeBot(playMode,move)
                    },time)
            }



        },
        //gibt den aktuellen Spieler aus und wechselt 
        //den auf den neuen Spieler
        playerTurn : function(){

            ++ticTacToe.data.move
            const player = this.data.turn
            this.data.turn = this.data.turn === 'playerOne' ?
            'playerTwo' : 'playerOne'
            
            return player
        },
        checkWin : function(player){
            
            const playerPicks = this.data[player].picks
            const winCombs = this.data.winCombs

            //überprüft ob der Spieler eine GewinnCombination erreicht hat
            //Bingo!
            if(playerPicks.length >= 3){
                winCombs.forEach(comb => {
                    if(comb.every(num => playerPicks.includes(num))){
                        this.data.win = true
                        winningComb = comb
                    }
                })
            }
            
            //wenn gewonnen , werden die Punkte aktualisiert
            if(this.data.win){
                this.updatePoints(player)
            }
            
            return this.data.win
        },
        updatePoints : function(player){
            
            //aktualisiert und zeigt Punktestand an
            ++this.data[player].points
            this.playerInfo.forEach(item => {
                if(item.classList.contains(player)){
                    item.childNodes[3].textContent = `Wins: ${this.data[player].points}`
                }
            })

        },

        //balken um Verhältnis Von Siegen und Unentschieden anzuzeigen

        barStats : function(){


            const bar = ticTacToe.bar
            const playerOnePoints = ticTacToe.data.playerOne.points
            const playerTwoPoints = ticTacToe.data.playerTwo.points
            const rounds = ticTacToe.data.round
            const draws = rounds -playerOnePoints -playerTwoPoints
            const sum = playerOnePoints+playerTwoPoints+ draws
            const width = bar.clientWidth
            const part = width/sum
            const points = [playerOnePoints,playerTwoPoints,draws]
            const bars = [blueBar,greenBar,drawBar]

            bars.forEach((bar,index) => {

                bar.style.width = part*points[index] + 'px' 
            })

        },


        //wenn runde endet wird der statsBalken akualisiert
        //und das spiel reset
        gameEnd : function(player,win){
            
            ++this.data.round
            
            if(win){
                
                this.data.win = false;
                console.log(`${player} won`)
            }else{
                console.log('its a draw')
            }
            this.barStats(win)

            setTimeout(this.reset,500)

            
        },

        //setzt SpielDaten nach jeder runde zurück 
        reset : function (){
            

                const endlessMode = ticTacToe.endless.checked


                    ticTacToe.data.playerTwo.picks = []
                    ticTacToe.data.playerOne.picks = []
                    ticTacToe.data.listener =[]
                    ticTacToe.data.turn = 'playerOne'
                    ticTacToe.data.move = 0
                    
                    ticTacToe.data.win = false
                    ticTacToe.data.start = true;
                    ticTacToe.bindEvent()
                    ticTacToe.setFieldIndex()
                    ticTacToe.fields.forEach(field => field.textContent = '')


                    //startet einen neue runde im AIVsAi modus + endless mode
                    if(endlessMode){
                        ticTacToe.round()
                    }


            
        },

        //rendert die züge der Spieler
        render : function (player,field){
            
            const marker = this.data[player].marker
            const span = document.createElement('span')

            const cName = `${marker}Marker`
            span.classList.add(cName)
            span.textContent = marker
            field.append(span)
            
        },
        
        ticTacToeBot : function(playMode,move){

            const player = ticTacToe.playerTurn()
            
            move = ticTacToe.data.move
            

            

            pick = ticTacToe.aiPick(player)
            this.data[player].picks.push(pick)


            const field = (function (){
                for(const field of ticTacToe.fields){
                    const num = +field.getAttribute('num')
                    
                    if(num === pick){
                        return field
                    } 
                }
            })()

            
            const win = ticTacToe.checkWin(player)
            
            if(playMode === 'humanVsAi'){
                ticTacToe.modeHumanVsAi(move,player,field,win)

            }else{
                ticTacToe.modeAiVsAi(move,player,field,win)
            }

        },
        modeAiVsAi :function(move,player,field,win){

            if(move <=9){
                ticTacToe.render(player,field)
            }

            if(win || move === 9){
                ticTacToe.gameEnd(player,win)
            }else{
                ticTacToe.round() 
            }

        },
        modeHumanVsAi : function(move,player,field,win){
            ticTacToe.removeListener(field)

            if(move <9){
                ticTacToe.render(player,field)
            }
            
            if(win){
                ticTacToe.gameEnd(player,win)
            }


        },
        aiPick : function(player){
            
            const enemy = player === 'playerOne' ? 'playerTwo' : 'playerOne'
            
            
            const playerPicks = ticTacToe.data[player].picks
            const enemyPicks = ticTacToe.data[enemy].picks
            const winCombs  = ticTacToe.data.winCombs
            
            
            const possPicks = ticTacToe.aiLogic.possiblePicks(playerPicks,enemyPicks)
            const [playerPoss,playerWin] = ticTacToe.aiLogic.playerCombs(playerPicks,enemyPicks,winCombs)
            const [enemyPoss,enemyWin] = ticTacToe.aiLogic.enemyCombs(playerPicks,enemyPicks,winCombs)
            const dangerArr = []
            const bestArr   = []
            ticTacToe.aiLogic.dangerPick(enemyWin,enemyPicks,possPicks,dangerArr)
            ticTacToe.aiLogic.bestPick(playerWin,playerPicks,possPicks,bestArr)
            
            let pick;
            const difficulty =   player ==='playerOne' ? ticTacToe.data.difficultyAi1
                                                       : ticTacToe.data.difficultyAi2
            console.log(playerWin,enemyWin,playerPoss,possPicks)
             if((bestArr.length > 0 || dangerArr.length > 0) && !(difficulty == 0)){
                pick = ticTacToe.aiLogic.necPick(bestArr,dangerArr)
                
            }else{
                switch (difficulty){
                    case '0' : pick = ticTacToe.aiLogic.randomPick(possPicks);break;
                    case '1' : pick = ticTacToe.aiLogic.goodPick(playerWin,playerPoss,possPicks);break;
                    case '2' : pick = ticTacToe.aiLogic.betterPick(playerWin,enemyWin,playerPoss,possPicks)   
                }
            }
                return pick
        },
        aiLogic :{
            rdmGen : function(arr){
                
                const rdm =  Math.floor(Math.random()*arr.length)

                return arr[rdm]

            },
            possiblePicks : function(playerOnePicks,playerTwoPicks){
                
                const possPicks = (function(){
                    
                    const arr = []
                        const nums = [0,1,2,3,4,5,6,7,8]
                        
                        nums.forEach(num => {
                            if(!playerOnePicks.includes(num) && !playerTwoPicks.includes(num)){
                                arr.push(num)
                            }
                        })
                        
                        return arr
                    })()

                    return possPicks
                },
                playerCombs : function(playerOnePicks,playerTwoPicks,winCombs){

                    const getPossWins = (value) => !playerTwoPicks.includes(value)
                    const checkPossWins = (value) => playerOnePicks.includes(value)
                    const playerArr = []
                    let playerWinArr = []
                    

                    winCombs.forEach(comb => {
                        if(comb.every(getPossWins)){
                            playerArr.push(comb)
                        }
                    })
                    
                    playerArr.forEach(comb => {
                        if(comb.some(checkPossWins)){
                            playerWinArr.push(comb)
                        }
                    })
                    
                    if(playerWinArr.length === 0){
                        playerWinArr = [...playerArr]
                    }


                    return [playerArr,playerWinArr]
                },
                enemyCombs : function(playerOnePicks,playerTwoPicks,winCombs){

                    const getPossWins = (value) => !playerOnePicks.includes(value) 
                    const checkPossWins = (value) => playerTwoPicks.includes(value)

                    
                    
                    const enemyArr = []
                    const enemyWinArr = []

                    winCombs.forEach(comb => {
                        if(comb.every(getPossWins)){
                            enemyArr.push(comb)
                        }
                        
                    })
                    
                    enemyArr.forEach(comb => {
                        if(comb.some(checkPossWins)){
                            
                            enemyWinArr.push(comb)
                        }
                    })

                    return [enemyArr,enemyWinArr]
                },
                dangerPick : function(enemyPicks,playerOnePicks,possPicks,dangerArr){

                    enemyPicks.forEach(comb => {
                        let count = 0
                        playerOnePicks.forEach(item => {
                            if(comb.includes(item)){
                                ++count
                                if(count ===2){
                                    comb.forEach(item => {
                                        if(possPicks.includes(item)){
                                            dangerArr.push(item)
                                        }
                                    })
                                }
                            }
                        })
                    })

                },
                bestPick : function(winningArr,playerTwoPicks,possPicks,bestArr){
                    winningArr.forEach(comb => {
                        let count = 0
                        playerTwoPicks.forEach((item,index) => {
                            if(comb.includes(item)){
                                ++count
                                if(count ===2){
                                    comb.forEach(item => {
                                        if(possPicks.includes(item)){
                                            bestArr.push(item)
                                        }
                                    })
                                }
                            }
                        })
                    })
                },
                randomPick: function(possPicks){
                
                    return this.rdmGen(possPicks)

                },
                goodPick : function(winningArr,possArr,possPicks){

                    let array = []

                    if(winningArr.length > 0 || possArr.length > 0){

                        let arr = winningArr.length > 0 ? [...winningArr] : [...possArr]
                        arr = [...new Set(arr.flat())]
                        arr.forEach(num => {
                            
                            if(possPicks.includes(num)){
                                array.push(num)
                            }
                            
                        })

                    }else{
                        array = [...possPicks]
                    }
                    
                    return ticTacToe.aiLogic.rdmGen(array)

                    },
                necPick : function(bestArr,dangerArr){

                    const array = bestArr.length > 0 ? bestArr : dangerArr

                    return ticTacToe.aiLogic.rdmGen(array)
                },
                betterPick : function(winArr,enemyWin,possArr,possPicks){
    
                    let array = []
                    const enemyArr  = ticTacToe.aiLogic.getFrequence(enemyWin,possPicks)
                    const playerArr = ticTacToe.aiLogic.getFrequence(winArr,possPicks)
                    const middleMarker = ticTacToe.data.playerOne.picks.includes(4) ?
                                         'enemy' : 'player'

                    const checkMiddle = middleMarker === 'player'

                    if(winArr.length > 0){
                        array = playerArr.filter(num => enemyArr.includes(num))
                        if(array.length === 2 && checkMiddle){
                            array = playerArr.filter(num => !enemyArr.includes(num))
                        }
                        if(array.length === 0){
                            array = playerArr
                        }

                    }else if(possArr.length > 0){
                        arr = ticTacToe.aiLogic.getFrequence(possArr,possPicks)
                        array = arr.filter(num => enemyArr.includes(num))

                    }else{
                        array = [...possPicks]
                    }
                    

                    const pick = ticTacToe.aiLogic.rdmGen(array)

                    

                    return pick

                },
                getFrequence : function(arr,possPicks){

                    const count = {}
                    const numbers = arr.flat()


                    numbers.forEach(num => count[num] = (count[num] || 0) + 1 )

                    let maxfreq = 0;

                    let pickArr =[]

                    for(const num in count){
                        

                        if(possPicks.includes(+num)){
                           
                            if(count[num] > maxfreq){
                                pickArr = []
                                maxfreq = count[num]
                                pickArr.push(+num)
                            }else if(count[num] == maxfreq){
                                pickArr.push(+num)
                            }
                        }


                    }
                    
                    return pickArr
                }, 
            },
        
        
    }
    
    ticTacToe.init()
}())

