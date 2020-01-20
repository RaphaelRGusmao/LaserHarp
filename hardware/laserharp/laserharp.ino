/******************************************************************************/
/*                                 LaserHarp                                  */
/*                          Raphael dos Reis Gusmao                           */
/******************************************************************************/

#include "TimerOne.h"

/* Motor **********************************************************************/
#define MOTOR_PWM 11
volatile float motor_speed;

/* Speed Sensor ***************************************************************/
#define ENCODER 2
#define RPS_TARGET 55
volatile int pulses;
volatile int rps;

/* Lasers *********************************************************************/
#define LASER_BLUE 7
#define LASER_GREEN 8
#define LASER_WIDTH 0.1

/* Serial *********************************************************************/
#define BUFFER_LIMIT 64
char serial_buffer[BUFFER_LIMIT];

/* Values *********************************************************************/
int active;
char notes[BUFFER_LIMIT];
int n_strings;
float angle; char angle_temp[BUFFER_LIMIT];
float first_angle;
float step_angle;
float laser_angle;
int i;
bool is_initial_position;
bool making_lasers;
volatile float time_per_degree;

/******************************************************************************/
/* Utils                                                                      */
/******************************************************************************/
int serial_read() {
  if (Serial.available() == 0) return 0;
  char *c = serial_buffer;
  int i = 0;
  while (Serial.available() > 0 && i < BUFFER_LIMIT-1) {
    *c = Serial.read();
    c++; i++;
    delay(4);
  }
  *c = '\0';
  if (i == BUFFER_LIMIT-1) serial_flush();
  return 1;
}

/******************************************************************************/
void serial_flush() {
  while (Serial.available() > 0) {
    Serial.read();
    delay(1);
  }
}

/******************************************************************************/
int is_equal(char *s1, char *s2) {
  return !strcmp(s1, s2);
}

/******************************************************************************/
void parse_values() {
  sscanf(serial_buffer, "%s %s", notes, angle_temp);
  angle = atof(angle_temp);
  n_strings = strlen(notes);
  first_angle = 45-(n_strings-1)*angle/4;
  step_angle = angle/2;

  // Serial.print("notes: "); Serial.println(notes);
  // Serial.print("angle: "); Serial.println(angle);
  // Serial.print("n_strings: "); Serial.println(n_strings);
  // Serial.print("first_angle: "); Serial.println(first_angle);
  // Serial.println("--------------------");
}

/******************************************************************************/
float calculateSpeed() {
  if (rps != RPS_TARGET && rps > 0) {
    motor_speed *= (float)RPS_TARGET/rps;
    motor_speed = min(motor_speed, 255);
    time_per_degree = (float)100000/36/rps;
  }
}

/******************************************************************************/
void delay_angle(float ang) {
  delayMicroseconds(round(time_per_degree*ang));
}

/******************************************************************************/
/* Timers                                                                     */
/******************************************************************************/
void timerIsr() {
  Timer1.detachInterrupt();

  rps = pulses;
  pulses = 0;

  calculateSpeed();
  motor_run(motor_speed);

  // Serial.print("motor_speed: "); Serial.print(motor_speed); Serial.print(",\t");
  // Serial.print("time_per_degree: "); Serial.print(time_per_degree); Serial.print(",\t");
  // Serial.print("rpm: "); Serial.print(rps*60); Serial.print(",\t");
  // Serial.print("rps: "); Serial.println(rps);

  Timer1.attachInterrupt(timerIsr);
}

/******************************************************************************/
void pulse() {
  pulses++;
  if (!making_lasers) is_initial_position = true;
}

/******************************************************************************/
/* Motor                                                                      */
/******************************************************************************/
void motor_run(float speed) {
  analogWrite(MOTOR_PWM, speed);
}

/******************************************************************************/
void motor_stop() {
  digitalWrite(MOTOR_PWM, LOW);
}

/******************************************************************************/
/* Lasers                                                                     */
/******************************************************************************/
void emit_laser(int color) {
  digitalWrite(color, HIGH);
  delay_angle(laser_angle);
  digitalWrite(color, LOW);
}

/******************************************************************************/
void make_lasers() {
  making_lasers = true;

  delay_angle(first_angle - 20);

  for (i = 0; i < n_strings; i++) {
    if (notes[i]-41 == LASER_GREEN) {
      emit_laser(LASER_GREEN);
      delay_angle(step_angle - laser_angle);
    } else {
      delay_angle(step_angle);
    }
  }

  delay_angle(2*first_angle - step_angle + 180);

  for (i = 0; i < n_strings; i++) {
    if (notes[i]-41 == LASER_BLUE) {
      emit_laser(LASER_BLUE);
      delay_angle(step_angle - laser_angle);
    } else {
      delay_angle(step_angle);
    }
  }

  making_lasers = false;
}

/******************************************************************************/
/* Setup                                                                      */
/******************************************************************************/
void setup() {
  Serial.begin(9600);

  TCCR2B = TCCR2B & B11111000 | B00000001;
  pinMode(MOTOR_PWM, OUTPUT);
  pinMode(ENCODER, INPUT);
  pinMode(LASER_BLUE, OUTPUT);
  pinMode(LASER_GREEN, OUTPUT);

  // digitalWrite(LASER_BLUE, HIGH);
  // digitalWrite(LASER_GREEN, HIGH);

  pulses = 0;
  attachInterrupt(digitalPinToInterrupt(ENCODER), pulse, RISING);
  Timer1.initialize(1000000);
  laser_angle = LASER_WIDTH/2;

  Serial.println("LASERHARP");
}

/******************************************************************************/
/* Loops                                                                      */
/******************************************************************************/
void loop() {
  standby_loop();
  main_loop();
}

/******************************************************************************/
void standby_loop() {
  while (!active) {
    if (serial_read()) {
      parse_values();
      is_initial_position = false;
      making_lasers = false;
      motor_speed = 150;
      motor_run(motor_speed);
      Timer1.attachInterrupt(timerIsr);
      active = 1;
      break;
    }
    delay(100);
  }
}

/******************************************************************************/
void main_loop() {
  while (active) {
    if (serial_read()) {
      if (is_equal(serial_buffer, "PAUSE")) {
        Timer1.detachInterrupt();
        motor_stop();
        active = 0;
        break;
      }
    }
    if (is_initial_position) {
      is_initial_position = false;
      make_lasers();
    }
  }
}

/******************************************************************************/
