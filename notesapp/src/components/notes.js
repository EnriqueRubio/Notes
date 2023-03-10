import React from 'react'

function Notes(props) {
  return (
    <div>
        <h1>Notas desde MongoDB</h1>
        {props.notes.map((note) => {
            return (
                <div key={note.id}>
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                </div>
            );
        })}
    </div>
  );
}

export default Notes;