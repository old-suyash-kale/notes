import Services from './index';
import { oUser } from './User';

class Notes extends Services {
    get() {
        return this.toServer({
            url: 'Notes'
        });
    };
    add({ title, description }) {
        return this.toServer({
            url: 'Notes',
            type: 'POST',
            data: { title, description }
        });
    };
    updateTitle({ note_id, title }) {
        return this.doAjax({
            url: `Notes/Title/${note_id}`,
            type: 'PUT',
            data: { title }
        });
    };
    updateDescription({ note_id, description }) {
        return this.doAjax({
            url: `Notes/Description/${note_id}`,
            type: 'PUT',
            data: { description }
        });
    };
    trash({ note_id }) {
        return this.toServer({
            url: `Notes/${note_id}`,
            type: 'DELETE'
        });
    };
    share({ note_id }) {
        return this.toServer({
            url: `Notes/Share/${note_id}`,
            type: 'POST'
        });
    };
    getShared(oNote) {
        return this.toServer({
            url: `Notes/Share/${oNote}`,
            type: 'GET'
        });
    };
    pin({ note_id, pin }) {
        return this.toServer({
            url: `Notes/Pin/${note_id}`,
            type: 'POST',
            data: { pin }
        });
    };
};

let oNotes = new Notes({oUser});

export {
    Notes,
    oNotes
}