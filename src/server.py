#!/usr/bin/env python
#
# term.py serial_port port_speed
#
import serial
import asyncio
import json
import sys
import time
import websockets

#  check command line arguments
if (len(sys.argv) != 3):
   print("command line: term.py serial_port speed")
   sys.exit()

port = sys.argv[1]
speed = int(sys.argv[2])

# open serial port
ser = serial.Serial(port,speed)
ser.setDTR()
print("opened serial port")

# flush buffers
ser.flushInput()
ser.flushOutput()
print("flushed buffers")

async def publish_serial(websocket, path):
	print("in publish serial")
	global buf
	name = await websocket.recv()
	print("\n\nConnected to " + name)


	byte2 = 0
	byte3 = 0
	byte4 = 0
	ser.flush()
	while 1:
		# find framing. when bytes 1-4 match 1,2,3,4, we can expect the
		# x,y,z acceleration values to be in the rights spots
		byte1 = byte2
		byte2 = byte3
		byte3 = byte4
		byte4 = ord(ser.read())
		if ((byte1 == 1) & (byte2 == 2) & (byte3 == 3) & (byte4 == 4)):
			break

	EPS = 0.1 # filter
	xfilt = yfilt = zfilt = 0

	counter = 0
	while True:
		# inWaiting returns the number of bytes in the input buffer
		input_buffer_byte_count = ser.inWaiting()
		if (input_buffer_byte_count != 0):
			x0 = ord(ser.read())
			x1 = ord(ser.read())
			y0 = ord(ser.read())
			y1 = ord(ser.read())
			z0 = ord(ser.read())
			z1 = ord(ser.read())

			x = x0+255*x1
			if (0x8000 & x):
				x = -(0x10000-x)
			xfilt = (1-EPS)*xfilt+EPS*x

			y = y0+255*y1
			if (0x8000 & y):
				y = -(0x10000-y)
			yfilt = (1-EPS)*yfilt+EPS*y

			z = z0+255*z1
			if (0x8000 & z):
				z = -(0x10000-z)
			zfilt = (1-EPS)*zfilt+EPS*z

			x_value = "%.0f"%xfilt
			y_value = "%.0f"%yfilt
			z_value = "%.0f"%zfilt

			message = json.dumps({
				'x': x_value,
				'y': y_value,
				'z': z_value,
			});
			print("created message:")
			print(message)
			print("sending message w/ websocket")
			counter += 1
			if counter%10 == 0:
				await websocket.send(message)

start_server = websockets.serve(publish_serial, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
