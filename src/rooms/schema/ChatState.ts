import { Schema, Context, type } from "@colyseus/schema";

export class Chatstate extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";

}
