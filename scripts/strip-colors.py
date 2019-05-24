import re
import sys 
import codecs

from JUtils import JUtils
from JLogger import JLogger

logger = JLogger()

#UTF8Reader = codecs.getreader('utf8')
#sys.stdin = UTF8Reader(sys.stdin)

def main():
    VERSION="1.0.0"
    DATE="8/14/2018"

    sTeeFile = ""
    bAppend = False
    s_debug_level = "INFO"

    global PROG_PATH 
    PROG_PATH = sys.argv[0]

    i = 1
    #for i in range(len(sys.argv)):
    while i < len(sys.argv):
        #print("sys.argv[%d]=\"%s\""%(i, sys.argv[i]))
        if sys.argv[i].lower() == "-dbg":
            i += 1
            s_debug_level = sys.argv[i]
        elif sys.argv[i].lower() == "-tee":
            i += 1
            sTeeFile = sys.argv[i]
        elif sys.argv[i].lower() == "-a":
            bAppend = True

        i += 1

    logger.debug("s_debug_level = \"%s\"" % s_debug_level )
    #print("logger.getLevel() = ", logger.getLevel() )
    logger.debug("Calling logger.setLevelString(\"" + s_debug_level + "\")...");
    logger.setLevelString(s_debug_level)
    logger.debug("s_debug_level = \"%s\"" % s_debug_level )

    logger.debug("sTeeFile = \"%s\"..." % (sTeeFile) )
    logger.debug("bAppend = %r..." % (bAppend) )

    fh_tee_file = None
            
    if len(sTeeFile) > 0:
        # use "ab" -- append binary
        # ...or... "wb" -- write binary
        # "Yes, Virginia, there _is_ a ternary operator in Python..."
        #sMode = "ab" if bAppend else "wb"
        sMode = "a" if bAppend else "w"

        logger.debug("sMode = %r..." % (sMode) )

        logger.debug("Opening file %r with mode %r..." % (sTeeFile, sMode) )

        fh_tee_file = open( sTeeFile, mode=sMode, encoding="utf8" )
        #fh_tee_file = open( sTeeFile, mode=sMode )

    s_line = ""
    num_subs = 0

    # For log4js's output... 
    # e.g., "[36m[2015-06-08 12:38:18.524] [DEBUG] pants - [39mSomething for pants
    re_log4j = re.compile("\033\\[3[0-9]m")
    logger.debug("re_log4j = %s" % re_log4j )

    # For karma's output...
    # e.g., "[1A[2KChrome 43.0.2357 (Windows 7 0.0.0): Executed 0 of 8 SUCCESS (0 secs / 0 secs)"
    re_karma = re.compile("\033\\[[0-9][A-Z]")
    logger.debug("re_karma = %s" % re_karma )

    # For Jest... e.g., "^M^[[K^M^[[1A^M^[[K^M^[[1A"
    re_jest = re.compile("\033\\[[A-Z]")
    logger.debug("re_jest = %s" % re_jest)

    i_count = 0
    for s_line in sys.stdin:
        i_count += 1
        #s_line = unicode(s_line)
        logger.debug("#%d: s_line =  \"%s\"..." % (i_count, s_line))

        # Print unchanged to stdout...
        print(s_line, file=sys.stdout, flush=True)

        (s_line, num_subs) = re.subn(pattern=re_log4j, repl="", string=s_line)

        logger.debug("#%d: line for re_log4j: num_subs = %d" % (i_count, num_subs ))
        logger.debug("#%d: after re_log4js: s_line = \"%s\"" % (i_count, s_line) )

        (s_line, num_subs) = re.subn(pattern=re_karma, repl="", string=s_line)

        logger.debug("#%d: for re_karma: num_subs = %d" % (i_count, num_subs) )
        logger.debug("#%d: after re_karma: s_line = \"%s\"" % (i_count, s_line) )

        (s_line, num_subs) = re.subn(pattern=re_jest, repl="", string=s_line)

        logger.debug("#%d: for re_jest: num_subs = %d" % (i_count, num_subs) )

        logger.debug("#%d: after sanitizing: s_line = \"%s\"" % (i_count, s_line) )

        if fh_tee_file:
            if not s_line.isspace():
                logger.debug("#%d: SHEMP: printin' s_line to fh_tee_file, Moe..." % (i_count) )
                #print(s_line.encode('ascii'), file=fh_tee_file, flush=True)
                print(s_line, file=fh_tee_file, flush=True)
            else:
                logger.debug("#%d: SHEMP: Looks like nuttin' but whitespace, so not printin' s_line to fh_tee_file, Moe..." % (i_count) )


# Automatically kick-start main()...
# https://stackoverflow.com/questions/1590608/is-it-possible-to-forward-declare-a-function-in-python
if __name__=="__main__":
   main()
