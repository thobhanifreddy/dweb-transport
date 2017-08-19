# dweb-transport

Welcome to the Internet Archive's Decentralized Wed (Dweb) libraries. 

## Running the examples
Once the source is checked out, you should be able to open any of the files:
[example_block.html](examples/example_block.html);
[example_smartdict.html](examples/example_smartdict.html); 
[example_list.html](examples/example_list.html); 
or [objbrowser.html](examples/objbrowser.html); 
directly in your browser.

###BLOCK example
In your browser, open the file:  examples/example_block.html  
Type some text into the editor and hit Save  
A hash should appear below.  
If it doesn't then open the browser console (e.g. Firefox/tools/Web Developer/Web Console)  
Click "FetchIt" and the data should be returned.

###SMART DICT example
In your browser, open the file:  examples/example_smartdict.html  
Type some text into the name, and a HTML color nmae into the color (e.g. "red") and hit Save  
A hash should appear below.  
If it doesn't then open the browser console (e.g. Firefox/tools/Web Developer/Web Console)  
Click "FetchIt" and the data should be returned and displayed.  
Hover over "Object Browser" to see the structure of the object.

###COMMON LIST example
In your browser, open the file:  examples/example_smartdict.html  
Click New and enter a name for your list  
A blank list should appear along with the name and hashes (retrieved from Dweb)  
Enter something in the text field and hit Send  
The item should be announced to the list and appear in the text field above.

The link icons next to the private hash can be opened on another machine and gives 
the user ability to also write to the list.

The link icon next to the public hash will only give them the ability to display the list.

Hover over "Object Browser" to see the structure of the object.


## Installing a compilable version
If you haven't already, then install npm from [https://nodejs.org/en/download]  
And on a Mac you'll need Xcode from the App store.  
Then install the dependencies: ```> npm install --dev```

Note that this gets a forked version of libsodium-wrappers from (Mitra's repository)[https://github.com/mitra42/libsodium.js], 
as the current libsodium-wrappers release doesn't have urlsafebase54.

Often the first run of ```> npm install --dev``` generates a lot of warnings and a second, 
virtually clean run gives more confidence that the install worked.

Now compile the javascript library for the browser: ```> npm run bundle_transport_ipfs```

If this worked without errors, try the node specific test. ```> npm run test```

This should start a IPFS instance, and generate some messages ending in "delaying 10 secs" and "Completed test".
It will leave the IPFS instance running and usually will need a Ctrl-C to exit.

##Major Issues


Please not there is an issue on some Firefox versions (seen on 54.0.1, not on 49.0.2 for example) that is currently leaking Threads and slowing the machine down
drastically. This is being explored! 

##See also:

The documentation for the Internet Archive's Dweb project is currently on Google (yes, we appreciate the irony). 

[API docs](https://docs.google.com/document/d/1_MttdWglsIOIajqtiSW5AWuf6YObZP8AA2LF9OV4xOM/edit#)  
[Top level doc on project and links](https://docs.google.com/document/d/1-lI352gV_ma5ObAO02XwwyQHhqbC8GnAaysuxgR2dQo/edit#)


