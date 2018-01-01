import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

class DialogStore {
  @observable currentDialog = "";
  @observable isOpen = false;

  open(dialog) {
    this.isOpen = true;
    this.currentDialog = dialog;
  }

  close() {
    this.isOpen = false;
  }
}

const store = new DialogStore();
window.dialogStore = store;

export const dialogStore = store;


@observer
class DialogRoot extends React.Component {
  render() {
    const { children } = this.props;

    // Find the dialog to be displayed. This needs to be done even
    // if open is false, to allow for smooth transitions.
    const dialog = React.Children.toArray(children).find(el => {
      return el.props && el.props.name === store.currentDialog;
    });

    if (dialog === undefined) return null;

    // Inject the necessary props into the dialog
    return React.cloneElement(dialog, {
      onClose: () => store.close(),
      open: store.isOpen,
    });
  }
}

export default DialogRoot;
