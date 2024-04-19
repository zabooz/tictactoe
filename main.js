(function (){

    const ticTacToe = {
    
        init: function(){
            this.cacheDom()
            this.startBtn.addEventListener('click', this.gameStart)
            this.ai.addEventListener('click', this.setAI)
            
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
            aiFirstPick: true,
        },
        cacheDom : function(){
            this.fields = document.querySelectorAll('.field')
            this.playerNames = document.querySelectorAll('.playerName')
            this.ai = document.querySelector('#ai')
            this.aiTwo =document.querySelector	('#ai2')
            this.startBtn = document.querySelector('#start')
            this.playerInfo = document.querySelectorAll('.playerInfo')
            this.WinsOne = document.querySelector('#playerOneWins')
            this.WinsTwo = document.querySelector('#playerTwoWins')
            this.NameOne = document.querySelector('#playerOneName')
            this.NameTwo = document.querySelector('#playerTwoName')

        },
        createPlayer : function(playerNames){
            playerNames.forEach(player =>{
                const name = player.value
                const marker = player.id === 'playerOne' ? 'X' : 'O'
                const picks = []
                const points = 0
                this.data[player.id] = {name,marker,picks,points}
            })
    
        },
        setAI: function(){
           
                const checked = ticTacToe.ai.checked
                let setName = document.querySelector('#playerTwo')
                checked === true ? setName.value = 'SkyNet' : setName.value = 'playerTwo'
          
        },
        gameStart : function(){
            const restart = ticTacToe.startBtn.textContent === 'Restart'
            if(restart){
                ticTacToe.reset(restart)
            }
            ticTacToe.startBtn.textContent = 'Restart'
            ticTacToe.data.listener =[]
            ticTacToe.createPlayer(ticTacToe.playerNames)
            ticTacToe.bind()
            ticTacToe.showPlayerStats()  

        },
        bind : function(){

            this.fields.forEach((field,index) => {

                
                const event = function(){
                    return ticTacToe.round
                }()

                field.setAttribute('num', index)
                field.addEventListener('click',event)
                this.data.listener.push(event)
            })

        },
        showPlayerStats : function (){

            ticTacToe.NameOne.textContent = ticTacToe.data.playerOne.name
            ticTacToe.NameTwo.textContent = ticTacToe.data.playerTwo.name
            ticTacToe.WinsTwo.textContent = 'Wins: 0';
            ticTacToe.WinsOne.textContent = 'Wins: 0';

        },
        removeListener: function(field){

            const index = field.getAttribute('num')
            field.removeEventListener('click', this.data.listener[index])

        },

        round : function(e){

            const player = ticTacToe.playerTurn();
            const playerPicks = ticTacToe.data[player].picks
            let field = e.target
            let pick = +field.getAttribute('num')
            
            playerPicks.push(pick)
            const move = ++ticTacToe.data.move

            const win = ticTacToe.checkWin(player)
            if(ticTacToe.ai.checked && !win && move <9){
                
                ticTacToe.skyNet()
            }


            ticTacToe.render(player,field)
            ticTacToe.removeListener(field)
          
            if(win || move === 9){
                return ticTacToe.gameEnd(player,win)
            }

        },
        playerTurn : function(){
            
            const player = this.data.turn
            this.data.turn = this.data.turn === 'playerOne' ?
            'playerTwo' : 'playerOne'
            
            return player
        },
        checkWin : function(player){
            
            const playerPicks = this.data[player].picks
            const winCombs = this.data.winCombs
            
            if(playerPicks.length >= 3){
                winCombs.forEach(comb => {
                    if(comb.every(num => playerPicks.includes(num))){
                        this.data.win = true
                    }
                })
            }
            
            if(this.data.win){
                this.updatePoints(player)
            }
            
            return this.data.win
        },
        updatePoints : function(player){
            
            ++this.data[player].points
            this.playerInfo.forEach(item => {
                if(item.classList.contains(player)){
                    item.childNodes[3].textContent = `Wins: ${this.data[player].points}`
                }
            })
            
        },
        gameEnd : function(player,win){

            ++this.data.round
            if(win){
                
                this.data.win = false;
                console.log(`${player} won`)
            }else{
                console.log('its a draw')
            }
            this.reset()
            
            
        },
        reset : function (restart){
            
            const time = restart ? 100 : 1500

            setTimeout(function(){
                
                ticTacToe.data.playerTwo.picks = []
                ticTacToe.data.playerOne.picks = []
                ticTacToe.data.listener =[]
                ticTacToe.data.turn = 'playerOne'
                ticTacToe.data.move = 0
                ticTacToe.data.win = false
                ticTacToe.bind()
                ticTacToe.data.aiFirstPick = true;
                
                ticTacToe.fields.forEach(field => field.textContent = '')
            },time)
            
        },
        render : function (player,field){
            
            const marker = this.data[player].marker
            const span = document.createElement('span')
            span.textContent = marker
            field.append(span)
            
        },
        aiLogic :{

                possPicks : function(){
                    const playerOnePicks = ticTacToe.data.playerOne.picks
                    const playerTwoPicks = ticTacToe.data.playerTwo.picks
                    const winCombs = ticTacToe.data.winCombs
                    const possPicks = (function(){
                        
                        //RAndom algo-----------------------
                        const arr = []
                        const nums = [0,1,2,3,4,5,6,7,8]
                        
                        
                        nums.forEach(num => {
                            if(!playerOnePicks.includes(num) && !playerTwoPicks.includes(num)){
                                arr.push(num)
                            }
                        })
                        
                        return arr
                    })()

                    
                    

                        
                        
                        //Enemy PICK----------------------------
                        const enemyPossWins = (value) => !playerTwoPicks.includes(value)
                        const enemyCheckWins = (value) => playerOnePicks.includes(value)
                        const enemyArr = []
                        const enemyArr2 = []
                        

                        winCombs.forEach(comb => {
                            if(comb.every(enemyPossWins)){
                                enemyArr.push(comb)
                            }
                        })
                        
                        enemyArr.forEach(comb => {
                            if(comb.some(enemyCheckWins)){
                                enemyArr2.push(comb)
                            }
                        })
                        
                        // OWN PICKS------------------------------
                        
                        const getPossWins = (value) => !playerOnePicks.includes(value) 
                        const checkPossWins = (value) => playerTwoPicks.includes(value)

                        
                        
                        const possArr = []
                        const winningArr = []
                        const dangerArr = []
                        const bestArr = []
                        winCombs.forEach(comb => {
                            if(comb.every(getPossWins)){
                                possArr.push(comb)
                            }
                            
                        })
                        
                        possArr.forEach(comb => {
                            if(comb.some(checkPossWins)){
                                
                                winningArr.push(comb)
                            }
                        })
                        
                        enemyArr2.forEach(comb => {
                            let count = 0
                            playerOnePicks.forEach((item,index) => {
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
                        
                        goodPick = (possArr,winningArr) =>  {

                            let array
                            if(winningArr.length >0 || possArr.length >0 ){
                                array = winningArr.length !== 0 ? winningArr : possArr 

                            }else{
                                array = [...possPicks]
                            }

                            
                            const count = {}
                            const arr = array.flat()

                            arr.forEach(num => count[num] = (count[num] || 0) +1)

                            let freq = 0
                            let maxfreq = 0
                            
                            for(const num in count){

                                if(count[num] >= maxfreq){
                                        console.log(num,possPicks)
                                            freq = num
                                            maxfreq = count[num]
                                }
                            }
                            
                                return +freq
                            
                        }


                        // firstPick = () => {
                        //     const arr = [0,2,4,6,8]
                        //     const rdm = Math.floor(Math.random()*arr.length)

                        //     return arr[rdm]
                        // }


                        necPick = (dangerArr,bestArr) => {

                            const arr = bestArr.length>0? bestArr : dangerArr

                            const rdm = Math.floor(Math.random()*arr.length)

                            return arr[rdm]

                        }


                        
                        
                        let pick;
    
                        if(bestArr.length >0 || dangerArr.length>0){
                            pick = necPick(dangerArr,bestArr)
                            
                        }else{
                            pick = goodPick(possArr,winningArr)
                           
                        }
                    
                    return pick
                },
               
        
        },
        skyNet : function(){
            const player = ticTacToe.playerTurn()
            pick = ticTacToe.aiLogic.possPicks()
            const move = ++ticTacToe.data.move
            this.data.playerTwo.picks.push(pick) 
            const field = (function (){
                for(const field of ticTacToe.fields){
                    const num = +field.getAttribute('num')
                    if(num === pick){
                        return field
                    } 
                }
            })()
           
            setTimeout(function(){
                if(move <9)
                ticTacToe.removeListener(field)
                ticTacToe.render(player,field)
            },300)
            
            const win = ticTacToe.checkWin(player)
            if(win || move === 9){
                return ticTacToe.gameEnd(player,win)
            }
        },
        
    }
    
    ticTacToe.init()
}())

