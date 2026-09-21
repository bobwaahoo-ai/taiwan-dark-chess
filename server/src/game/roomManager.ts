import crypto from "node:crypto";import {GameState,PlayerId,PublicGameState} from "../types/game.js";import {createGame} from "./engine.js";
export interface HistoryEntry{before:GameState;by:PlayerId;label:string}
export class RoomManager{rooms=new Map<string,GameState>();history=new Map<string,HistoryEntry[]>();
get(id:string){let r=this.rooms.get(id);if(!r){r=createGame(id);this.rooms.set(id,r);this.history.set(id,[])}return r}
join(id:string,name:string,socketId:string,token?:string){const r=this.get(id);let p=token?r.players.find(x=>x.token===token):undefined;if(p){p.socketId=socketId;p.name=name.trim().slice(0,24)||p.name;p.connected=true}else{if(r.players.length>=2)throw Error("房間已滿");const pid:PlayerId=r.players.length?"p2":"p1";p={id:pid,name:name.trim().slice(0,24)||`玩家${r.players.length+1}`,socketId,token:crypto.randomUUID(),connected:true};r.players.push(p)}if(r.players.length===2&&r.status==="waiting")r.status="playing";return{room:r,player:p,token:p.token}}
disconnect(socketId:string){for(const r of this.rooms.values()){const p=r.players.find(x=>x.socketId===socketId);if(p)p.connected=false}}
public(r:GameState):PublicGameState{return{roomId:r.roomId,players:r.players.map(({token,...p})=>p),board:r.board.map(p=>p&&p.revealed?{id:p.id,revealed:true,type:p.type,color:p.color}:{id:p!.id,revealed:false}),turn:r.turn,status:r.status,winner:r.winner,undoRequest:r.undoRequest,messages:r.messages,moveNumber:r.moveNumber,firstFlipDone:r.firstFlipDone,lastAction:r.lastAction}}
snapshot(r:GameState){return structuredClone(r)}
push(r:GameState,by:PlayerId,label:string,before:GameState){const h=this.history.get(r.roomId)!;h.push({before,by,label});if(h.length>30)h.shift()}
last(id:string){const h=this.history.get(id)!;return h[h.length-1]}
undo(r:GameState){const h=this.history.get(r.roomId)!;const x=h.pop();if(!x)return false;const restored=structuredClone(x.before);restored.undoRequest=undefined;this.rooms.set(r.roomId,restored);return true}
reset(id:string){const old=this.get(id),fresh=createGame(id);fresh.players=old.players.map(p=>({...p,color:undefined}));fresh.status=fresh.players.length===2?"playing":"waiting";this.rooms.set(id,fresh);this.history.set(id,[]);return fresh}}
