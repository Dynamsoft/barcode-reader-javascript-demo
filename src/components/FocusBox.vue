<template>
    <div class="focusBox" :style="{'--top': focusCvsTop, '--left': focusCvsLeft}" ref="focusBox" v-show="bShowFocusBox">
        <canvas class="focusCvs" ref="focusCvs" width="68" height="68"></canvas>
        <div class="tapToFocus" v-show="bShowText">Tap to focus</div>
    </div>
</template>
  
<script > 
import Vue from "vue";

export default Vue.extend({
    name: "FocusBox",
    data() {
        return {
            focusCvsTop: "50%",
            focusCvsLeft: "50%",
            bShowFocusBox: true,
            bShowText: true,
            focusBoxTimeout: null,
        }
    },
    mounted() { 
        this.createCvsAndDrawBorder();
        
        window.addEventListener("click", (e) => {
            if(!this.bNeedFocus(e)) return;
            if(this.bShowText) this.bShowText = false;
            if(this.focusBoxTimeout) {clearTimeout(this.focusBoxTimeout);}
            this.focusCvsTop = e.clientY+"px";
            this.focusCvsLeft = e.clientX+"px";
            this.$refs.focusCvs.style.animation = "none";
            this.$refs.focusCvs.offsetHeight;
            this.$refs.focusCvs.style.animation = null;
            if(!this.bShowFocusBox) this.bShowFocusBox = true;
            this.focusBoxTimeout = setTimeout(()=>{
                this.bShowFocusBox = false;
            },2000);
        });
    },
    methods: {
        createCvsAndDrawBorder() {
            const focusCvs = this.$refs.focusCvs;
            const ctx = focusCvs.getContext("2d");
            ctx.lineJoin = "round";
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            this.drawArc(ctx,0,24,0,4,0,0,4,0,7,24,0);
            this.drawArc(ctx,44,0,64,0,68,0,68,4,7,68,24);
            this.drawArc(ctx,68,44,68,64,68,68,64,68,7,44,68);
            this.drawArc(ctx,24,68,4,68,0,68,0,64,7,0,44);
            ctx.stroke();

            this.focusBoxTimeout = setTimeout(()=>{
                this.bShowFocusBox = false;
                this.bShowText = false;
            },3000);
        },
        drawArc(ctx, hlStartX, hlStartY, hlEndX, hlEndY, firstControllX, firstControllY, secondControllX, secondControllY, radian, endX, endY) {
            ctx.moveTo(hlStartX,hlStartY);
            ctx.lineTo(hlEndX,hlEndY);
            ctx.arcTo(firstControllX,firstControllY,secondControllX,secondControllY,radian);
            ctx.lineTo(endX,endY);
        },
        bNeedFocus(e) {
            return !(e.target.className !== "dce-scanarea" && e.target.className !== "torchContainer" && e.target.nodeName !== "CANVAS");
        }
    }
});
</script>

<style scoped>
.focusBox {width: 68px;height: 68px;position: absolute;top: var(--top);left: var(--left);transform: translate(-50%,-50%);z-index: 1;}
.focusBox .focusCvs {width: 100%;height: 100%;animation: scale 0.2s linear alternate 5;z-index: 1;}
.focusBox .tapToFocus {width: 106px; height: 29px;position: absolute;bottom: -65%;transform: translateX(-17px); background-color: rgba(148, 147, 147, 0.4);border-radius: 5px;margin-top: 20px;text-align: center;line-height: 29px;font-family: "OpenSans-Regular";color: #fff;}
@keyframes scale {from {transform: scale(1.1);} to {transform: scale(1);}}
</style>
  