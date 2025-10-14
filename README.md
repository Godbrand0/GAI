GAI			
===

> **status: Development (Heavy on Frontend, Backend and Machine Learning)**

Build with AI: Language Translator for Nigerian Local Languages, extensible into application (Cloud, Native and Embedded or Extension).

Rationale
---------

This is to ensure bi-lateral communication regardless of the language people use to speak to each other during a conversation, conference, meeting, thereby reducing the need to learn certain languages which then hinders communication, since we are in the digital world.

Use-Case
--------

1. Chatting Application extensible into other applications (Cloud, Native, Desktop, Mobile) for real-time involvement and communication; This makes it standalone and extensible into other multi-media voice, text and video calling / chatting applications as an extension.

2. To-Be-Decided (TBD).

Core Components of the Use Case: Extensible Chatting Application (Language_Chatting)
-----------------------------------------------------------------------------------
1. Chat Interface: Users are enabled with the ability to speak into the application in their source language (use case: Nigerian Yoruba), the interface is seamless enough to provide real-time feedback, such as animated microphones that pops up, and wavy-graphics that shows the user is speaking, with captions of what the user says in real-time into the application.

2. Model Pipeline (Automated, Embedded and Offline): The model is embedded into the application, and this makes it work in par to the local server built into the application as well. The speech input of the user is received (first, listened too by the chat-system, then passed to this pipeline). The user is sending a message or communicating to another user of the chat application. The following components of the model pipeline make this process complete:

2.1. Settings of users: This component handles the settings and preferences of the user, which the model pipeline recognizes, and stores for all future communication and workload, such as the user's preferred language when speaking so the model can understand what the user is saying, and the user's preferred target language when receiving a voice message. The target language could be another language the user wants the model to listen for and process, regardless of what the language the message of the sender is.

2.2. Language Translation: This is the core of the model, and the reason we have collected datasets, the language translator changes the source language of the speaker with all of the captions generated to the desired target language of the receiver, in real time fostering clear communication, based off preferences.

2.3. Closed Captioning: This is handled by the frontend as the user speaks into the chat interface but mostly synchronized with this pipeline to ensure clear communication, accurate translation and efficient captioning of what both user's are saying and translating.

Development Process
-------------------

1. Collection of Datasets in multiple Nigerian Languages. - 1 day.

2. Activation of APIs (provided by Google AI for Chrome Browsers). - 1 day.

3. Building of Frontend, landing page and core components for the web (cloud) - 1 day.
 
4. Parallel development of server, api handlers and model pipelines. - 1.5 days.

5. Training of Models to work with the APIs provided and datasets collected. - 2 days.
6. Final Endpoint developments. - 2 days.
   
7. Integration with Frontend. - 1 day.
8. Delivery. - same day (before 20th)

9. Extras __(1. Mobile Application)__ - Before 20th.

10. Extras __(2. Extension)__ - Before 20th.

11. Extras __(3. Advanced Pipeline Fine-Tuning with more nigerian language datasets)__ - After the 20th, before the 23rd.  

Application Instructions
------------------------

1.) 0

2.) 1

3.) 2

4.) 3

5.) 4

6.) 5

7.) 6

8.) 7

9.) 8

10.) 9

License
-------


GAI Licensed.
