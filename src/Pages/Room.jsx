import React, { useEffect, useRef } from 'react';
import { useState } from 'react'
import styles from './frame.module.css'

function Room(props) {
    const [room, setRoom] = useState("");
    const [isRoomJoined, setIsRoomJoined] = useState(false);
    const [frame, setFrame] = useState([[[]]])
    const ws = useRef(null);


    useEffect(() => {
      if(room !== "" && isRoomJoined){
        ws.current = new WebSocket("ws://localhost:8089/ws");
        ws.current.onopen = () => {
          ws.current.send(JSON.stringify({
            chat_type: "JOIN",
            value:room
          }))
        };
        ws.current.onclose = () => console.log("ws closed");
        ws.current.onmessage = e => {
            const message = JSON.parse(e.data);
            setFrame(message);
            console.log("e", message);
        };
        const wsCurrent = ws.current;



        return () => {
            wsCurrent.close();
        };

      }
    }, [room, isRoomJoined])

    return (
      <div>
        <h1>Room {props.name}</h1>  
        {
          !isRoomJoined && 
          <div>
            <input value={room} onChange={evt => setRoom(evt.target.value)}/><br/><br/>
            <button onClick={()=>setIsRoomJoined(true)}> Join Room </button>
          </div>
        }
        {
          isRoomJoined && 
          <div>
              <button  onClick={console.log(isRoomJoined)}> Room {room}</button>
              <table>
                <tbody>
                  {
                    frame.map((y)=>{
                      return <tr>
                        {
                          y.map((x)=>{
                            return <td>{x}</td>
                          })
                        }
                      </tr>
                    })
                  }
                </tbody>
              </table>              
          </div>
        }        
      </div>
    );
}

export default Room;