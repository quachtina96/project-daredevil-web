'''
Useful for running to test what versions of python and serial you are running
this script with.

Python 2 and 3 each need the serial module to be installed.
'''

import sys
import serial

def main():
    print(sys.version) #check python version
    print(serial.__version__) #check pyserial version


if __name__ == '__main__':
    main()