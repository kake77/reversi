const cdir=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];//8方向のベクトル配列

//表示用の要素の取得
var board=document.getElementById("board");
var sign=document.getElementById("sign");
var numStone=document.getElementById("numStone");

var stones=[];//表示用要素の配列
var data=[];//それぞれの場所のイニの色の情報を保持する配列
var order=0;//0:黒 1:白

//石を生成し、それをdata,stonesに格納
for(var i=0;i<8;i++){
    stones[i]=[];
    data[i]=[]
    for(j=0;j<8;j++){
        var Stop=12.5*(0.5+i);
        var Sleft=12.5*(0.5+j);
        var tmp=document.createElement("div");
        tmp.setAttribute("class","stone");
        tmp.setAttribute("style","top:"+Stop+"vh; left:"+Sleft+"vh;");
        tmp.setAttribute("onclick","hit("+i+","+j+");");
        board.appendChild(tmp);
        stones[i][j]=tmp;
    }
}
//座標(x,y)の場所の石の色をidの色に変更する関数
var change=function(x,y,id){
    var color="";
    if(id==0){
        color="#000";
    }else if(id==1){
        color="#fff";
    }else{
        color="#0000";
    }
    stones[x][y].style.background=color;
    data[x][y]=id;
}

//初期化関数（真ん中４つの石を配置して順番を黒からにする）
var ini=function(){
    for(var i=0;i<8;i++){
        for(var j=0;j<8;j++){
            change(i,j,2);
        }
    }

    change(3,3,1);
    change(3,4,0);
    change(4,3,0);
    change(4,4,1);

    numStone.innerHTML="黒:2<br>白:2";
    sign.innerHTML="黒の番";
    order=0;
}

//終了処理(石の数に従ってどっちが勝ったかを判定する)
var fin=function(winner){
    if(winner>0){
        sign.innerHTML="黒の勝ち";
    }else if(winner<0){
        sign.innerHTML="白の勝ち";
    }else{
        sign.innerHTML="引き分け";
    }
}

//手番をもう片方に移す処理
//詰み状態の判定もし、積んでいたらもう一度同じプレイヤーの番、全部同じ色で埋まっていたら試合終了
var next=function(){
    order=(order+1)%2;
    var countStones=[0,0,0];//黒,白,置ける場所
    for(var i=0;i<8;i++){
        for(var j=0;j<8;j++){
            if(data[i][j]==2){
                for(var k=0;k<8;k++){
                    countStones[2]=countStones[2]+check(i,j,k,0);
                }
            }else{
                countStones[data[i][j]]++;
            }
        }
    }

    numStone.innerHTML="黒:"+countStones[0]+"<br>白:"+countStones[1];
    if(countStones[0]+countStones[1]==64||countStones[0]==0||countStones[1]==0){
        fin(countStones[0]-countStones[1]);
        
    }
    if(countStones[2]==0){
        order=(order+1)%2;
        return;
    }

    if(order){
        sign.innerHTML="白の番";
    }else{
        sign.innerHTML="黒の番";
    }
}

//一直線に石をひっくり返す関数
var rev=function(x,y,dir,num){
    for(var i=1;i<num;i++){
        change(x+i*cdir[dir][0],y+i*cdir[dir][1],order);
    }
}

//そこに石を置いてひっくり返せるか判定する関数
var check=function(x,y,dir,flag){
    
    var i=1;
    while(0<=x+i*cdir[dir][0]&&x+i*cdir[dir][0]<=7&&0<=y+i*cdir[dir][1]&&y+i*cdir[dir][1]<=7&&data[x+i*cdir[dir][0]][y+i*cdir[dir][1]]!=2){
        if(order==data[x+i*cdir[dir][0]][y+i*cdir[dir][1]]){
            if(flag==1){
                rev(x,y,dir,i);
            }
            return i-1;
        }
        i++;
    }
    return 0;
}
//石を置く処理の関数
var hit=function(x,y){
    var count=0;
    if(data[x][y]!=2){
        return;
    }
    for(var i=0;i<8;i++){
        count=count+check(x,y,i,1);
    }
    if(count==0){
        return;
    }
    change(x,y,order);
    next();  
}
ini();
