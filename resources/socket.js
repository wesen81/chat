/**
 * This class is a chat application
 */
class Chat{

	constructor(url, autoStart, debug) {

		/**
		 * @const {String} URL
		 * Url of SOCKET.io
		 */
		this.URL = url || "http://185.13.90.140:8081";

		/**
		 * @const {String} USER_CONNECTION
		 * If user connected to the chat
		 */
		this.USER_CONNECTION = "User connection";

		/**
		 * @const {String} USER_DISCONNECTION
		 * If user disconnected from the chat
		 */
		this.USER_DISCONNECTION = "User disconnection";

		/**
		 * @const {Boolean} DEBUG
		 * If it's true, debug mode is active
		 */
		this.DEBUG = !!debug;

		if (autoStart) this.start();
		if (this.DEBUG) window.CHAT = this;
	}

	/**
	 * Start chat application;
	 */
	start() {
		let me        = this,
			userEl    = me.getUserEl(),
			messageEl = me.getMessageEl(),
			socket    = io.connect(me.URL);

		// websocket
		me.SOCKET = socket;

		// init events
		me.initEvents();

		// if user connected to the chat
		socket.on('connect', function (data) {
			console.log(me.USER_CONNECTION);

			// if user disconnected
			socket.on("disconnect", function(data) {
				console.log(me.USER_DISCONNECTION);
			});

			// if message
			socket.on("message", function(data) {

				let align, user, message;

				if (data && data.user) {

					user = data.user;
					message = data.message;

					if ("chatBot2000" === user) {
						align = "left";
						message = user + ": " + message;
					}
					else if ("echoBot2000" === user) {
						align = "right";
						message = message.replace(/.*:./, "");
					}

					me.addLine(message, align);
				}

				console.log(data);
			});


		});

	}

	/**
	 * Init sending button
	 */
	initEvents() {
		let me        = this,
			buttonEl  = this.getButtonEl(),
			messageEl = this.getMessageEl();

		buttonEl.addEventListener("click", me.onSend.bind(me));
		messageEl.addEventListener("keydown", function(e) {
			let key = e.which || e.keyCode;
			if (key === 13) { // 13 is enter
				me.onSend.apply(me)
			}
		});
	}


	/**
	 * @callback
	 */
	onSend() {
		this.fetch(
			this.getUserEl().value,
			this.getMessageEl().value
		);

		// clear message box
		this.getMessageEl().value = "";
	}


	/**
	 * Fetching message
	 * @param {String} user as user's nickname
	 * @param {String} msg as text content
	 */
	fetch(user, msg) {
		if (user && msg) {
			this.SOCKET
				.emit('message',  { message: msg , user: user });
		}
		else {
			console.log("ERROR: Write username and message!");

			// If you want this:
			//
			// this.addLine(
			// 	"Missing username or message!",
			// 	"center",
			// 	true
			// )
		}
	}

	/**
	 * Add new line to content
	 * @param {String} text as message text
	 * @param align {String}
	 * @param isError
	 */
	addLine(text, align, isError) {
		let contentEl = this.getContentEl(),
			line = document.createElement('div'),
			classList = line.classList;

		classList.add("line", align);

		if (isError) classList.add("error");

		line.textContent = text || "...";

		contentEl.appendChild(line);
		this.scrollContent();

	}

	/**
	 * When add new line, it is scrolling down
	 */
	scrollContent() {
		let contentEl = this.getContentEl(),
			height = contentEl.scrollHeight;

		contentEl.scrollTo(0, height);
	}

	/**
	 * Get name field
	 * @return {Element}
	 */
	getUserEl() {
		return document.querySelector("[name=user]");
	}

	/**
	 * Get message field
	 * @return {Element}
	 */
	getMessageEl() {
		return document.querySelector("[name=message]");
	}

	/**
	 * Get send button
	 * @return {Element}
	 */
	getButtonEl() {
		return document.querySelector("button");
	}

	/**
	 * Get content area
	 * @return {Element}
	 */
	getContentEl() {
		return document.getElementById("content");
	}

}