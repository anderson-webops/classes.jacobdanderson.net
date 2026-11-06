# Numerical Verification

Use the PHY17 supplied free-fall and oscillator cases. The file uses only the Python standard library.

Complete freefall_step with explicit Euler: x_next = x + v*h and v_next = v + a*h, both using old values. Complete oscillator_step for two methods: explicit Euler uses old x/v for both updates; symplectic Euler updates velocity first and uses that new velocity to update x.

Run python main.py. The untouched starter states that work remains; it does not print a completed physical result. A completed run reproduces the position errors 9.8, 4.9, 2.45 and 1.225 metres at 2 seconds. The oscillator compares energy at 0, 5, 10, 15 and 20 seconds with h=0.05 s, m=k=1, x0=1 and v0=0.

Keep units and update order with the output. Smaller steps can reduce discretization error; they do not repair an incorrect physical model. The script limits run size to 20000 steps.

This directory contains the worked reference implementation.
