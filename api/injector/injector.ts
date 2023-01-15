import * as awilix from 'awilix';
import expressApp from '../app';
import SocketApp from '../socket';

import { validateUserJWT } from '../middlewares';

import { ExampleCron, } from '../crons';

import { RootRouter, UltraMSGRouter, UsersRouter, WhatsappRouter, } from '../routes';

import {
    AccountService,
    AuthService,
    EmailService,
    JwtService,
    KonectaAIApiService,
    PdfService,
    PermissionsService,
    PythonService,
    QRService,
    S3Service,
    TemplateService,
    TwoFAService,
    UltraMSGService,
    UsersService,
    WhatsappService,
} from '../services';

import { RootController, UltraMSGController, UsersController, WhatsappController } from '../controllers';

import { UserSerializer } from '../serializers';
import { StripeService } from '../services/stripe.service';
import { OpenaiService } from '../services/openai.service';

const injector = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
});

// Inject services
injector.register({
    usersService: awilix.asClass(UsersService).singleton(),
    authService: awilix.asClass(AuthService).singleton(),
    jwtService: awilix.asClass(JwtService).singleton(),
    emailService: awilix.asClass(EmailService).singleton(),
    permissionsService: awilix.asClass(PermissionsService).singleton(),
    s3Service: awilix.asClass(S3Service).singleton(),
    pdfService: awilix.asClass(PdfService).singleton(),
    qrService: awilix.asClass(QRService).singleton(),
    whatsappService: awilix.asClass(WhatsappService).singleton(),
    templateService: awilix.asClass(TemplateService).singleton(),
    pythonService: awilix.asClass(PythonService).singleton(),
    twoFAService: awilix.asClass(TwoFAService).singleton(),
});


// Inject controllers
injector.register({
    rootController: awilix.asClass(RootController).singleton(),
    whatsappController: awilix.asClass(WhatsappController).singleton(),
    ultraMSGController: awilix.asClass(UltraMSGController).singleton(),
    usersController: awilix.asClass(UsersController).singleton(),
});

// Inject routers
injector.register({
    rootRouter: awilix.asFunction(RootRouter).singleton(),
    whatsappRouter: awilix.asFunction(WhatsappRouter).singleton(),
    ultraMSGRouter: awilix.asFunction(UltraMSGRouter).singleton(),
    usersRouter: awilix.asFunction(UsersRouter).singleton(),
});

// Inject middlewares
injector.register({
    validateUserJWT: awilix.asFunction(validateUserJWT).singleton(),
});

// Inject serializers
injector.register({
    userSerializer: awilix.asClass(UserSerializer).singleton(),
});

// Inject serializers
injector.register({
    userSerializer: awilix.asClass(UserSerializer).singleton(),
    ultraMSGService: awilix.asClass(UltraMSGService).singleton(),
    konectaAIApiService: awilix.asClass(KonectaAIApiService).singleton(),
    accountService: awilix.asClass(AccountService).singleton(),
    stripeService: awilix.asClass(StripeService).singleton(),
    openaiService: awilix.asClass(OpenaiService).singleton(),
});

// Inject Cron
injector.register({
    exampleCron: awilix.asClass(ExampleCron).singleton(),
});

// Application
injector.register({
    expressApp: awilix.asFunction(expressApp).singleton(),
    socketApp: awilix.asClass(SocketApp).singleton(),
});

// Inject intents
// injector.register({
//     intentRoot: awilix.asFunction(IntentRoot),
//
//     // WordPress
//     intentWordpressFlow: awilix.asClass(IntentWordpressFlow).singleton(),
//     intentWordpressFlowNewOrder: awilix.asClass(IntentWordpressFlowNewOrder).singleton(),
//     intentNewOrderCompletedConsultation: awilix.asClass(IntentNewOrderCompletedConsultation).singleton(),
//     intentNewOrderSignUp: awilix.asClass(IntentNewOrderSignUp).singleton(),
//     intentNewOrderSignUpMessageSent: awilix.asClass(IntentNewOrderSignUpMessageSent).singleton(),
//     intentNewOrderWhatIsMyConsultation: awilix.asClass(IntentNewOrderWhatIsMyConsultation).singleton(),
//     intentNewOrder2faReSend: awilix.asClass(IntentNewOrder2faReSend).singleton(),
//     intentNewOrderTimeOut2fa: awilix.asClass(IntentNewOrderTimeOut2fa).singleton(),
//     intentNewOrderSignUpChangeNumber: awilix.asClass(IntentNewOrderSignUpChangeNumber).singleton(),
//
//     // Whatsapp
//     intentWhatsappNewOrder2fa: awilix.asClass(IntentWhatsappNewOrder2fa).singleton(),
//     intentWhatsappNewOrderGuardContact: awilix.asClass(IntentWhatsappNewOrderGuardContact).singleton(),
//     intentWhatsappNewContactNewContact: awilix.asClass(IntentWhatsappNewContactNewContact).singleton(),
//     intentWhatsappNewOrderPaymentFailed: awilix.asClass(IntentWhatsappNewOrderPaymentFailed).singleton(),
//     intentWhatsappNewOrderPaymentCompleted: awilix.asClass(IntentWhatsappNewOrderPaymentCompleted).singleton(),
//     intentWhatsappNewOrderReferredContact: awilix.asClass(IntentWhatsappNewOrderReferredContact).singleton(),
// });


export default injector;
