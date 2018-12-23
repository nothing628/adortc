
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import ReactHabitat from 'react-habitat';
import Room from './components/Room';
import Chat from './components/Chat/App';

class MyApp extends ReactHabitat.Bootstrapper {
  constructor(){
    super();

    // Create a new container builder:
    const builder = new ReactHabitat.ContainerBuilder();

    // Register a component:
    builder.register(Room).as('Room');
    builder.register(Chat).as('Chat');

    // Finally, set the container:
    this.setContainer(builder.build());
  }
}

// Always export a 'new' instance so it immediately evokes:
export default new MyApp();
