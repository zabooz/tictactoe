(function (){

    const ticTacToe = {
    
        init: function(){
    
            this.cacheDom()
            this.bind()
            this.game()
    
        },
        data : {
            listener : [],
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
        },
        cacheDom : function(){
            this.fields = document.querySelectorAll('.field')
            this.playerOneName = document.querySelector('#player1')
            this.playerTwoName = document.querySelector('#player2')
            this.ai = document.querySelector('#ai').checked
        },
        createPlayer : function(player){

            let turn;
            let marker;
            const name = player.value
            

            if(player.id === 'player1'){

                turn = true;
                marker = 'X'
            }else{
                turn = false;
                marker = 'O'
            }

            return {
                name : name,
                turn: turn,
                marker: marker,
                picks: [],
            }
    
        },
        game : function(){
            
            this.data.playerOne = this.createPlayer(this.playerOneName)
            this.data.playerTwo = this.createPlayer(this.playerTwoName)



            
        },
        bind : function(){

            this.fields.forEach((field,index) => {


                field.setAttribute('num', index)
                field.addEventListener('click',this.playerPick.bind(this))
                
            })

        },

        playerPick : function(e){
            

            const player = this.data.playerOne.turn === true ? this.data.playerOne 
                                                             : this.data.playerTwo

            const pick = +e.target.getAttribute('num')
            

            this.playerTurn()

            player.picks.push(pick)

        },
        playerTurn : function(){

            let playerOne = this.data.playerOne
            let playerTwo = this.data.playerTwo

            if(playerOne.turn === true){
                playerOne.turn = false;
                playerTwo.turn = true 
            }else{
                playerTwo.turn= false
                playerOne.turn = true
            }

        }
    
        
    }
    
    ticTacToe.init()
}())

