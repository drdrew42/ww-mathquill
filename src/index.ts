import mathQuill from 'src/publicapi';
import { MQ_VERSION } from 'src/version';
import 'css/main.scss';

mathQuill.VERSION = MQ_VERSION;

window.MathQuill = mathQuill;
