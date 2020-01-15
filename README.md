The purpose of this application is to create a listener on any TCP or UDP port

**Arguments:**

 `-h \ --help`    Print help menu (this output)\
 `-u \ --udp`    UDP listener\
 `-p \ --port`   Port to use\
 `-b \ --binary`  Expect binary string (only used with -e and -r options)\
 `-e \ --expect`   String to expect\
 `-r \ --reply`    String to respond\

**Usage:**

Listen for TCP port 81<br>
```# nodejs echo.js -p 81```

Listen for UDP port 5060<br>
```# nodejs echo.js -u -p 5060```

Listen for TCP port 81, expect received hex to match \"00bbae\" and respond \"11aa22\" <br>
```# nodejs echo.js -b -p 81 -e "00bbae" -r "11aa22" ```

Listen for UDP port 50, expect received plain text string to match \"hello\" and respond \"world\" <br>
```# nodejs echo.js -u -p 5060 -e "hello" -r "world"```
