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
                ticTacToe.startBtn.textContent = 'Restart'
                ticTacToe.data.listener =[]
                ticTacToe.createPlayer(ticTacToe.playerNames)
                ticTacToe.bind()
                ticTacToe.showPlayerStats()  

        },
        bind : function(){

            this.fields.forEach((field,index) => {

                
                const event = function(){
                    return ticTacToe.playerPick
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

        playerPick : function(e){

            const player = ticTacToe.playerTurn();
            const playerPicks = ticTacToe.data[player].picks
            let field = e.target
            let pick = +field.getAttribute('num')
            
            playerPicks.push(pick)

            const win = ticTacToe.checkWin(player)
            if(ticTacToe.ai.checked && !win){
               
                ticTacToe.skyNet()
            }


            ticTacToe.render(player,field)
            ticTacToe.removeListener(field)

            const move = ++ticTacToe.data.move
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
        reset : function (){
            
            setTimeout(function(){
                
                ticTacToe.data.playerTwo.picks = []
                ticTacToe.data.playerOne.picks = []
                ticTacToe.data.listener =[]
                ticTacToe.data.turn = 'playerOne'
                ticTacToe.data.move = 0
                ticTacToe.data.win = false
                ticTacToe.bind()
                
                ticTacToe.fields.forEach(field => field.textContent = '')
            },1500)
            
        },
        render : function (player,field){
            
            const marker = this.data[player].marker
            const span = document.createElement('span')
            span.textContent = marker
            field.append(span)
            
        },
        aiLogic :{

                possPicks : function(){
                    const playerPicks = ticTacToe.data.playerOne.picks
                    const aiPicks = ticTacToe.data.playerTwo.picks
                    
                    const possPicks = (function(){
                        
                        const arr = []
                        const nums = [0,1,2,3,4,5,6,7,8]
                        
                        nums.forEach(num => {
                            if(!playerPicks.includes(num) && !aiPicks.includes(num)){
                                arr.push(num)
                            }
                        })
                        
                        return arr
                    })()
                    const rdm = Math.floor(Math.random()*possPicks.length)

    
                    return possPicks[rdm]
                },
                optionPicks: function(){


                }
        
        },
        skyNet : function(){
            const player = ticTacToe.playerTurn()
            pick = ticTacToe.aiLogic.possPicks()
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
                ticTacToe.render(player,field)
            },300)
            
            const win = ticTacToe.checkWin(player)
            if(win){
                return ticTacToe.gameEnd(player,win)
            }
        },
        
    }
    
    ticTacToe.init()
}())

