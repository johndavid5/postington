#-------------------------------------------------#
#           John D. Aynedjian 8/22/2018           #
#-------------------------------------------------#

import time

class JLogger:

    VERSION = '1.5.1'

    FATAL = 1
    ERROR = 2
    WARN = 3
    INFO = 4
    DEBUG = 5
    TRACE = 6

    def __init__(self):
        self.LEVEL = JLogger.INFO
        self.DEBUG_STREAM = None
        self.STDOUT_ON = True
        self.DEBUG_STREAM_ON = True

    def setLevel(self, level):
        if level != JLogger.FATAL and level != JLogger.ERROR and level != JLogger.WARN and level != JLogger.INFO and level != JLogger.DEBUG and level != JLogger.TRACE:
            raise ValueError('Got level=', level, '...level should be FATAL, ERROR, WARN, INFO, DEBUG, or TRACE')
        self.LEVEL = level

    def getLevel(self):
        return self.LEVEL

    def setLevelString(self, level_string):
        #print("JLogger::setLevelString()...calling level = JLogger.stringToLevel(\"", level_string, "\")...");
        level = JLogger.stringToLevel(level_string) 
        #print("JLogger::setLevelString()...level = ", level, "...");
        self.LEVEL = level

    def getLevelString(self):
        return JLogger.levelToString(self.LEVEL);
	
    def setStdoutOn(self, stdout_on):
        self.STDOUT_ON = stdout_on
	
    def getStdoutOn(self):
        return self.STDOUT_ON

    def setDebugStream(self,debug_strem):
        self.DEBUG_STREAM = debug_stream

    def getDebugStream(self):
        return self.DEBUG_STREAM

    def setDebugStreamOn(self,debug_strem_on):
        self.DEBUG_STREAM_ON = debug_stream_on

    def getDebugStreamOn(self):
        return self.DEBUG_STREAM_ON

    def print(self, level, msg):

        if self.would_print(level):
            s_out = "[" + JLogger.get_timestamp() + "][" + JLogger.levelToString(level) + "]: " + msg 

            # In case they forget to put an end-of-line on there...
            #if( $s_out !~ /\n$/ ){
            #	$s_out .= "\n";
            #}

            if self.STDOUT_ON:
                print( s_out )
            
            #debug_stream = self.DEBUG_STREAM
            #if self.DEBUG_STREAM_ON :
                #print debug_stream ( s_out );
	

    def fatal(self, msg):
        self.print(JLogger.FATAL, msg)

    def error(self, msg):
        self.print(JLogger.ERROR, msg)

    def warn(self, msg):
        self.print(JLogger.WARN, msg)

    def info(self, msg):
        self.print(JLogger.INFO, msg)

    def debug(self, msg):
        self.print(JLogger.DEBUG, msg)
 
    def trace(self, msg):
        self.print(JLogger.TRACE, msg)

    def would_print(self, level):
    
        #print("JLogger.would_print(): self.LEVEL=", self.LEVEL, ", level=", level, "...")         
        if self.LEVEL >= level:
            #print("would_print(): returnin' TRUE...\n");
            return True
        else:
            #print("would_print(): returnin' FALSE...\n");
            return False


#=item get_timestamp( $epoch_seconds = undef(), $bool_include_utc_offset = 0 )
#
#Outputs current timestamp of form C<"2013-07-25 14:21:25"> or 
#C<"2013-07-25 14:21:25 UTC-4:00"> if you set $bool_include_utc_offset
#to a non-zero value.
#
#If you supply $epoch_seconds, outputs timestamp based on $epoch_seconds.
#
#=cut
#    def get_timestamp( epoch_seconds = None, include_utc_offset = False ):
#
#        if epoch_seconds is None:
#            epoch_seconds = time();
#
#	my ($sec, $min, $hr, $day, $mon, $year) = localtime( $epoch_seconds );
#
#	my $output = sprintf("%04d-%02d-%02d %02d:%02d:%02d", 
#   	    1900 + $year, $mon + 1, $day, $hr, $min, $sec);
#
#	if( $include_utc_offset ){
#		$output .= " " . VF::Utils::getUtcOffsetString( $epoch_seconds );
#	}
#
#	return $output;
#
#}# get_timestamp()

    def get_timestamp():
        return time.strftime("%Y-%m-%d %H:%M:%S") 

    def levelToString(level):

        if level == JLogger.FATAL:
            return "FATAL"
        elif level == JLogger.ERROR:
            return "ERROR"
        elif level == JLogger.WARN:
            return "WARN"
        elif level == JLogger.INFO:
            return "INFO"
        elif level == JLogger.DEBUG:
            return "DEBUG"
        elif level == JLogger.TRACE:
            return "TRACE"
        else:
            raise ValueError('Level should be FATAL, ERROR, WARN, INFO, DEBUG, or TRACE')
            #return (str)level + "=???"


# Returns -1 if cannot find a match
# to input string.
    def stringToLevel(s_level_string):

        # Convert to uppercase, effectively making it
        # case-insensitive...
        s_level_string = s_level_string.upper()
		
        if s_level_string == "FATAL":
            return JLogger.FATAL
        elif s_level_string == "ERROR":
            return JLogger.ERROR
        elif s_level_string == "WARN":
            return JLogger.WARN
        elif s_level_string == "INFO":
            return JLogger.INFO
        elif s_level_string == "DEBUG":
            return JLogger.DEBUG
        elif s_level_string == "TRACE":
            return JLogger.TRACE
        else:
            raise ValueError("Got s_level string = ", s_level_string, "....level string should be 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', or 'TRACE'")
	    #return -1;


#=========================
#   STANDARD  FUNCTIONS
#=========================
#  sub trim() {
#    my ($istr)=@_;
#    $istr=~ s/^\s+//os; $istr=~ s/\s+$//os;
#   return($istr);
#  }
#
#1;
