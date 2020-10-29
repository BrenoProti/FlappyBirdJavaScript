console.log('[Breno Proti] Flappy Bird');

let frames = 0;

const somDe_HIT = new Audio();
somDe_HIT.src = "./efeitos/hit.wav"

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const msgGetReady = {
    spriteX: 134,
    spriteY: 0,
    largura:174,
    altura:152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,  
            msgGetReady.spriteX, msgGetReady.spriteY, 
            msgGetReady.largura, msgGetReady.altura, 
            msgGetReady.x, msgGetReady.y, 
            msgGetReady.largura, msgGetReady.altura,
        );
    }
}

//Background
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura:275,
    altura:204,
    x:0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70C5CE';
        contexto.fillRect(0,0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,  
            planoDeFundo.spriteX, planoDeFundo.spriteY, 
            planoDeFundo.largura, planoDeFundo.altura, 
            planoDeFundo.x, planoDeFundo.y, 
            planoDeFundo.largura, planoDeFundo.altura,
        );
        contexto.drawImage(
            sprites,  
            planoDeFundo.spriteX, planoDeFundo.spriteY, 
            planoDeFundo.largura, planoDeFundo.altura, 
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y, 
            planoDeFundo.largura, planoDeFundo.altura,
        );
    }
}

//Chão
function criaChao(){
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura:224,
        altura:112,
        x:0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 2;
            const repeteEm = chao.largura / 2

            const movimentacao = chao.x = chao.x - movimentoDoChao;
            chao.x = movimentacao % repeteEm;
        },
        desenha() {
            contexto.drawImage(
                sprites,  
                chao.spriteX, chao.spriteY, 
                chao.largura, chao.altura, 
                chao.x, chao.y, 
                chao.largura, chao.altura,
            );
            contexto.drawImage(
                sprites,  
                chao.spriteX, chao.spriteY, 
                chao.largura, chao.altura, 
                (chao.x + chao.largura), chao.y, 
                chao.largura, chao.altura,
            );
        }
    }
    return chao;
}


//Colisao
function fazColisao(flappyBird, chao){
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY){
      return true;  
    }
    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura:33,
        altura:24,
        x:30,
        y:50,
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        pula(){
            flappyBird.velocidade = - flappyBird.pulo;
        },
        
        atualiza() {
            if(fazColisao(flappyBird, globais.chao)) {
                console.log('Colidiu');
                somDe_HIT.play();

                setTimeout(() => {
                    mudaParaTela(telas.INICIO)
                }, 550)
                return;
            }
    
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            {spriteX: 0, spriteY: 0,},
            {spriteX: 0, spriteY: 26,},
            {spriteX: 0, spriteY: 52,},
            {spriteX: 0, spriteY: 26,},
        ],
        frameAtual: 0,
        atualziaFrameAtual(){
            const intervaloDeFrames = 9;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo){
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
            
        },
        desenha(){
            flappyBird.atualziaFrameAtual();
            const {spriteX, spriteY} = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                sprites,  
                spriteX, spriteY, 
                flappyBird.largura, flappyBird.altura, 
                flappyBird.x, flappyBird.y, 
                flappyBird.largura, flappyBird.altura,
            ); 
        },
    }
    return flappyBird;
}

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaço: 80,
        desenha() {
            

            canos.pares.forEach(function(par){
                const yRandom = par.y;
                const espacamentoEntreCanos = 100;

                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                contexto.drawImage(
                    sprites,  
                    canos.ceu.spriteX, canos.ceu.spriteY, 
                    canos.largura, canos.altura, 
                    canoCeuX, canoCeuY, 
                    canos.largura, canos.altura,
                ); 
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites,  
                    canos.chao.spriteX, canos.chao.spriteY, 
                    canos.largura, canos.altura, 
                    canoChaoX, canoChaoY, 
                    canos.largura, canos.altura,
                );

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY,
                },
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY,
                }

            })

             
        },
        
        temColisaoComFlappyBird(par){

            const cabecaDoFlappy = globais.flappyBird.y ;
            const peDoFlappy= globais.flappyBird.y + globais.flappyBird.altura; 

            if (globais.flappyBird.x >= par.x){
                if(cabecaDoFlappy <= par.canoCeu.y){
                    return true;
                }
                if(peDoFlappy >= par.canoChao.y){
                    return true;
                }
            }

            return false
        },
        pares:[],
        atualiza(){
            const passouFrames = frames % 100 === 0;
            if (passouFrames){
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }
            canos.pares.forEach(function(par){
                par.x = par.x -2;

                if (canos.temColisaoComFlappyBird(par)){
                    mudaParaTela(telas.INICIO)
                }

                if (par.x + canos.largura <= 0){
                    canos.pares.shift();
                }
            })
            
        }
    }

    return canos;
}


//TELAS
const globais = {};
let telaAtiva = {}
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
  
    if(telaAtiva.inicializa) {
      telaAtiva.inicializa();
    }
  }
const telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha(){
            planoDeFundo.desenha();
            globais.chao.desenha();   
            globais.flappyBird.desenha();
            
            msgGetReady.desenha();
        },
        click(){
            mudaParaTela(telas.JOGO);
        },
        atualiza(){
            globais.chao.atualiza();
        }
    }
}
telas.JOGO = {
    desenha(){
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();  
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza(){
        globais.flappyBird.atualiza();
        globais.canos.atualiza();
        globais.chao.atualiza();
        
        
    }
}


function loop (){
    telaAtiva.desenha();
    telaAtiva.atualiza();
    
    frames = frames + 1;
    requestAnimationFrame(loop); 
}

window.addEventListener('click', function(){
    if (telaAtiva.click) {
        telaAtiva.click(); 
    }
});

mudaParaTela(telas.INICIO);
loop();