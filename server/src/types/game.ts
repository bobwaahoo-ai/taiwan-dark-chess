export type Color="red"|"black";export type PlayerId="p1"|"p2";export type PieceType="general"|"advisor"|"elephant"|"chariot"|"horse"|"cannon"|"soldier";
export interface Piece{id:string;type:PieceType;color:Color;revealed:boolean}
export interface PublicPiece{id:string;revealed:boolean;type?:PieceType;color?:Color}
export interface Player{id:PlayerId;name:string;socketId:string;token:string;connected:boolean;color?:Color}
export interface ChatMessage{id:string;playerId:PlayerId;name:string;text:string;at:number}
export interface UndoRequest{by:PlayerId;actionLabel:string;at:number}
export interface GameState{roomId:string;players:Player[];board:Array<Piece|null>;turn:PlayerId;status:"waiting"|"playing"|"finished";winner?:PlayerId;undoRequest?:UndoRequest;messages:ChatMessage[];moveNumber:number;firstFlipDone:boolean;lastAction?:"flip"|"move"|"capture"}
export interface PublicGameState extends Omit<GameState,"board"|"players">{board:Array<PublicPiece|null>;players:Array<Omit<Player,"token">>}
