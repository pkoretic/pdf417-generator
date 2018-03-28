/**
 * BC Math Library for Javascript
 * Ported from the PHP5 bcmath extension source code,
 * which uses the libbcmath package...
 *    Copyright (C) 1991, 1992, 1993, 1994, 1997 Free Software Foundation, Inc.
 *    Copyright (C) 2000 Philip A. Nelson
 *     The Free Software Foundation, Inc.
 *     59 Temple Place, Suite 330
 *     Boston, MA 02111-1307 USA.
 *      e-mail:  philnelson@acm.org
 *     us-mail:  Philip A. Nelson
 *               Computer Science Department, 9062
 *               Western Washington University
 *               Bellingham, WA 98226-9062
 *
 * bcmath-js homepage:
 *
 * This code is covered under the LGPL licence, and can be used however you want :)
 * Be kind and share any decent code changes.
 */

var libbcmath = {
    PLUS: '+',
    MINUS: '-',
    BASE: 10,           // must be 10 (for now)
    scale: 0,           // default scale

    /**
     * Basic number structure
     */
    bc_num: function() {
        this.n_sign = null; // sign
        this.n_len = null;  /* (int) The number of digits before the decimal point. */
        this.n_scale = null; /* (int) The number of digits after the decimal point. */
        //this.n_refs = null; /* (int) The number of pointers to this number. */
        //this.n_text = null; /* ?? Linked list for available list. */
        this.n_value = null;  /* array as value, where 1.23 = [1,2,3] */
        this.toString = function() {
            var r, tmp;
            tmp=this.n_value.join('');

            // add minus sign (if applicable) then add the integer part
            r = ((this.n_sign == libbcmath.PLUS) ? '' : this.n_sign) + tmp.substr(0, this.n_len);

            // if decimal places, add a . and the decimal part
            if (this.n_scale > 0) {
                r += '.' + tmp.substr(this.n_len, this.n_scale);
            }
            return r;
        };

        this.setScale = function(newScale) {
            while (this.n_scale < newScale) {
                this.n_value.push(0);
                this.n_scale++;
            }
            while (this.n_scale > newScale) {
                this.n_value.pop();
                this.n_scale--;
            }
            return this;
        }

    },

    /**
     * @param int length
     * @param int scale
     * @return bc_num
     */
    bc_new_num: function(length, scale) {
        var temp; // bc_num
        temp            = new libbcmath.bc_num();
        temp.n_sign     = libbcmath.PLUS;
        temp.n_len      = length;
        temp.n_scale    = scale;
        temp.n_value    = libbcmath.safe_emalloc(1, length+scale, 0);
        libbcmath.memset(temp.n_value, 0, 0, length+scale);
        return temp;
    },

    safe_emalloc: function(size, len, extra) {
        return Array((size * len) + extra);
    },

    /**
     * Create a new number
     */
    bc_init_num: function() {
        return new libbcmath.bc_new_num(1,0);

    },

    _bc_rm_leading_zeros: function (num) {
        /* We can move n_value to point to the first non zero digit! */
        while ((num.n_value[0] === 0) && (num.n_len > 1)) {
            num.n_value.shift();
            num.n_len--;
        }
    },

    /**
     * Convert to bc_num detecting scale
     */
    php_str2num: function(str) {
        var p;
        p = str.indexOf('.');
        if (p==-1) {
            return libbcmath.bc_str2num(str, 0);
        } else {
            return libbcmath.bc_str2num(str, (str.length-p));
        }

    },

    CH_VAL: function(c) {
        return c - '0'; //??
    },

    BCD_CHAR: function(d) {
        return d + '0'; // ??
    },

    isdigit: function(c) {
        return (isNaN(parseInt(c,10)) ? false : true);
    },

    bc_str2num: function(str_in, scale) {
        var str,num, ptr, digits, strscale, zero_int, nptr;
        // remove any non-expected characters
        /* Check for valid number and count digits. */

        str=str_in.split(''); // convert to array
        ptr = 0;    // str
        digits = 0;
        strscale = 0;
        zero_int = false;
        if ( (str[ptr] === '+') || (str[ptr] === '-'))  {
            ptr++;  /* Sign */
        }
        while (str[ptr] === '0') {
            ptr++;            /* Skip leading zeros. */
        }
        //while (libbcmath.isdigit(str[ptr])) {
        while ((str[ptr]) % 1 === 0) { //libbcmath.isdigit(str[ptr])) {
            ptr++;
            digits++;    /* digits */
        }

        if (str[ptr] === '.') {
            ptr++;            /* decimal point */
        }
        //while (libbcmath.isdigit(str[ptr])) {
        while ((str[ptr]) % 1 === 0) { //libbcmath.isdigit(str[ptr])) {
            ptr++;
            strscale++;    /* digits */
        }

        if ((str[ptr]) || (digits+strscale === 0)) {
            // invalid number, return 0
            return libbcmath.bc_init_num();
              //*num = bc_copy_num (BCG(_zero_));
        }

        /* Adjust numbers and allocate storage and initialize fields. */
        strscale = libbcmath.MIN(strscale, scale);
        if (digits === 0) {
            zero_int = true;
            digits = 1;
        }

        num = libbcmath.bc_new_num(digits, strscale);

        /* Build the whole number. */
        ptr = 0; // str
        if (str[ptr] === '-') {
            num.n_sign = libbcmath.MINUS;
            //(*num)->n_sign = MINUS;
            ptr++;
        } else {
            num.n_sign = libbcmath.PLUS;
            //(*num)->n_sign = PLUS;
            if (str[ptr] === '+') {
                ptr++;
            }
        }
        while (str[ptr] === '0') {
            ptr++;            /* Skip leading zeros. */
        }

        nptr = 0; //(*num)->n_value;
        if (zero_int) {
            num.n_value[nptr++] = 0;
            digits = 0;
        }
        for (;digits > 0; digits--) {
            num.n_value[nptr++] = libbcmath.CH_VAL(str[ptr++]);
            //*nptr++ = CH_VAL(*ptr++);
        }

        /* Build the fractional part. */
        if (strscale > 0) {
            ptr++;  /* skip the decimal point! */
            for (;strscale > 0; strscale--) {
                num.n_value[nptr++] = libbcmath.CH_VAL(str[ptr++]);
            }
        }

        return num;
    },

    cint: function(v) {
        if (typeof(v) == 'undefined') {
            v = 0;
        }
        var x=parseInt(v,10);
        if (isNaN(x)) {
            x = 0;
        }
        return x;
    },

    /**
     * Basic min function
     * @param int
     * @param int
     */
    MIN: function(a, b) {
        return ((a > b) ? b : a);
    },

    /**
     * Basic max function
     * @param int
     * @param int
     */
    MAX: function(a, b) {
        return ((a > b) ? a : b);
    },

    /**
     * Basic odd function
     * @param int
     * @param int
     */
    ODD: function(a) {
        return (a & 1);
    },

    /**
     * replicate c function
     * @param array     return (by reference)
     * @param string    char to fill
     * @param int       length to fill
     */
    memset: function(r, ptr, chr, len) {
        var i;
        for (i=0;i<len;i++) {
            r[ptr+i] = chr;
        }
    },

    /**
     * Replacement c function
     * Obviously can't work like c does, so we've added an "offset" param so you could do memcpy(dest+1, src, len) as memcpy(dest, 1, src, len)
     * Also only works on arrays
     */
    memcpy: function(dest, ptr, src, srcptr, len) {
        var i;
        for (i=0;i<len;i++) {
            dest[ptr+i]=src[srcptr+i];
        }
        return true;
    },


    /**
     * Determine if the number specified is zero or not
     * @param bc_num num    number to check
     * @return boolean      true when zero, false when not zero.
     */
    bc_is_zero: function(num) {
        var count; // int
        var nptr; // int

        /* Quick check. */
        //if (num == BCG(_zero_)) return TRUE;

        /* Initialize */
        count = num.n_len + num.n_scale;
        nptr = 0; //num->n_value;

        /* The check */
        while ((count > 0) && (num.n_value[nptr++] === 0)) {
            count--;
        }

        if (count !== 0) {
            return false;
        } else {
            return true;
        }
    },

    bc_out_of_memory: function() {
        throw new Error("(BC) Out of memory");
    }
};


/* Some utility routines for the divide:  First a one digit multiply.
   NUM (with SIZE digits) is multiplied by DIGIT and the result is
   placed into RESULT.  It is written so that NUM and RESULT can be
   the same pointers.  */
/**
 *
 * @param array num     (pass by ref)
 * @param int size
 * @param int digit
 * @param array result  (pass by ref)
 */
libbcmath._one_mult = function(num, n_ptr, size, digit, result, r_ptr) {
    var carry, value; // int
    var nptr, rptr; // int pointers

     if (digit === 0) {
        libbcmath.memset(result, 0, 0, size);   //memset (result, 0, size);
    } else {
        if (digit == 1) {
            libbcmath.memcpy(result, r_ptr, num, n_ptr, size); //memcpy (result, num, size);
        } else {
            /*  Initialize */
            nptr = n_ptr+size-1; //nptr = (unsigned char *) (num+size-1);
            rptr = r_ptr+size-1; //rptr = (unsigned char *) (result+size-1);
            carry = 0;

            while (size-- > 0) {
                value = num[nptr--] * digit + carry; //value = *nptr-- * digit + carry;
                //result[rptr--] = libbcmath.cint(value % libbcmath.BASE); // @CHECK cint //*rptr-- = value % BASE;
                result[rptr--] = value % libbcmath.BASE; // @CHECK cint //*rptr-- = value % BASE;
                //carry = libbcmath.cint(value / libbcmath.BASE);   // @CHECK cint //carry = value / BASE;
                carry = Math.floor(value / libbcmath.BASE);   // @CHECK cint //carry = value / BASE;
            }

            if (carry != 0) {
                result[rptr] = carry;
            }
        }
    }
}


/* The full division routine. This computes N1 / N2.  It returns
   0 if the division is ok and the result is in QUOT.  The number of
   digits after the decimal point is SCALE. It returns -1 if division
   by zero is tried.  The algorithm is found in Knuth Vol 2. p237. */

libbcmath.bc_divide = function(n1, n2, scale) {
    var quot;   // bc_num return
    var qval; // bc_num
    var num1, num2; // string
    var ptr1, ptr2, n2ptr, qptr; // int pointers
    var scale1, val; // int
    var len1, len2, scale2, qdigits, extra, count; // int
    var qdig, qguess, borrow, carry; // int
    var mval; // string
    var zero; // char
    var norm; // int
    var ptrs; // return object from one_mul

    /* Test for divide by zero. (return failure) */
    if (libbcmath.bc_is_zero(n2)) {
        return -1;
    }

    /* Test for zero divide by anything (return zero) */
    if (libbcmath.bc_is_zero(n1)) {
        return libbcmath.bc_new_num(1, scale);
    }

    /* Test for n1 equals n2 (return 1 as n1 nor n2 are zero)
    if (libbcmath.bc_compare(n1, n2, libbcmath.MAX(n1.n_scale, n2.n_scale)) === 0) {
        quot=libbcmath.bc_new_num(1, scale);
        quot.n_value[0] = 1;
        return quot;
    }
    */

    /* Test for divide by 1.  If it is we must truncate. */
    // todo: check where scale > 0 too.. can't see why not (ie bc_is_zero - add bc_is_one function)
    if (n2.n_scale === 0) {
        if (n2.n_len === 1 && n2.n_value[0] === 1) {
            qval = libbcmath.bc_new_num(n1.n_len, scale);       //qval = bc_new_num (n1->n_len, scale);
            qval.n_sign = (n1.n_sign == n2.n_sign ? libbcmath.PLUS : libbcmath.MINUS);
            libbcmath.memset(qval.n_value, n1.n_len, 0, scale); //memset (&qval->n_value[n1->n_len],0,scale);
            libbcmath.memcpy(qval.n_value, 0, n1.n_value, 0, n1.n_len + libbcmath.MIN(n1.n_scale, scale)); //memcpy (qval->n_value, n1->n_value, n1->n_len + MIN(n1->n_scale,scale));
            // can we return here? not in c src, but can't see why-not.
            // return qval;
        }
    }

    /* Set up the divide.  Move the decimal point on n1 by n2's scale.
     Remember, zeros on the end of num2 are wasted effort for dividing. */
    scale2 = n2.n_scale;    //scale2 = n2->n_scale;
    n2ptr = n2.n_len + scale2 - 1;  //n2ptr = (unsigned char *) n2.n_value+n2.n_len+scale2-1;
    while ((scale2 > 0) && (n2.n_value[n2ptr--] === 0)) {
        scale2--;
    }

    len1 = n1.n_len + scale2;
    scale1 = n1.n_scale - scale2;
    if (scale1 < scale) {
        extra = scale - scale1;
    } else {
        extra = 0;
    }

    num1 = libbcmath.safe_emalloc(1, n1.n_len + n1.n_scale, extra + 2); //num1 = (unsigned char *) safe_emalloc (1, n1.n_len+n1.n_scale, extra+2);
    if (num1 === null) {
        libbcmath.bc_out_of_memory();
    }
    libbcmath.memset(num1, 0, 0, n1.n_len+n1.n_scale+extra+2); //memset (num1, 0, n1->n_len+n1->n_scale+extra+2);
    libbcmath.memcpy(num1, 1, n1.n_value, 0, n1.n_len+n1.n_scale); //memcpy (num1+1, n1.n_value, n1.n_len+n1.n_scale);

    len2 = n2.n_len + scale2;  // len2 = n2->n_len + scale2;
    num2 = libbcmath.safe_emalloc(1, len2, 1);//num2 = (unsigned char *) safe_emalloc (1, len2, 1);
    if (num2 === null) {
        libbcmath.bc_out_of_memory();
    }
    libbcmath.memcpy(num2, 0, n2.n_value, 0, len2);  //memcpy (num2, n2.n_value, len2);
    num2[len2] = 0;   // *(num2+len2) = 0;
    n2ptr = 0; //n2ptr = num2;

    while (num2[n2ptr] === 0) {   // while (*n2ptr == 0)
        n2ptr++;
        len2--;
    }

    /* Calculate the number of quotient digits. */
    if (len2 > len1+scale) {
        qdigits = scale+1;
        zero = true;
    } else {
        zero = false;
        if (len2>len1) {
            qdigits = scale+1;      /* One for the zero integer part. */
        } else {
            qdigits = len1-len2+scale+1;
        }
    }

    /* Allocate and zero the storage for the quotient. */
    qval = libbcmath.bc_new_num(qdigits-scale,scale);   //qval = bc_new_num (qdigits-scale,scale);
    libbcmath.memset(qval.n_value, 0, 0, qdigits); //memset (qval->n_value, 0, qdigits);

    /* Allocate storage for the temporary storage mval. */
    mval = libbcmath.safe_emalloc(1, len2, 1); //mval = (unsigned char *) safe_emalloc (1, len2, 1);
    if (mval === null) {
        libbcmath.bc_out_of_memory();
    }

    /* Now for the full divide algorithm. */
    if (!zero) {
        /* Normalize */
        //norm = libbcmath.cint(10 / (libbcmath.cint(n2.n_value[n2ptr]) + 1)); //norm =  10 / ((int)*n2ptr + 1);
        norm = Math.floor(10 / (n2.n_value[n2ptr] + 1)); //norm =  10 / ((int)*n2ptr + 1);
        if (norm != 1) {
            libbcmath._one_mult(num1, 0, len1+scale1+extra+1, norm, num1, 0); //libbcmath._one_mult(num1, len1+scale1+extra+1, norm, num1);
            libbcmath._one_mult(n2.n_value, n2ptr, len2, norm, n2.n_value, n2ptr); //libbcmath._one_mult(n2ptr, len2, norm, n2ptr);

            // @CHECK Is the pointer affected by the call? if so, maybe need to adjust points on return?

        }

        /* Initialize divide loop. */
        qdig = 0;
        if (len2 > len1) {
            qptr = len2-len1; //qptr = (unsigned char *) qval.n_value+len2-len1;
        }  else {
            qptr = 0; //qptr = (unsigned char *) qval.n_value;
        }

        /* Loop */
        while (qdig <= len1+scale-len2) {
            /* Calculate the quotient digit guess. */
            if (n2.n_value[n2ptr] == num1[qdig]) {
                qguess = 9;
            } else {
                qguess = Math.floor((num1[qdig]*10 + num1[qdig+1]) / n2.n_value[n2ptr]);
            }
            /* Test qguess. */

            if (n2.n_value[n2ptr+1]*qguess > (num1[qdig]*10 + num1[qdig+1] - n2.n_value[n2ptr]*qguess)*10 + num1[qdig+2]) { //if (n2ptr[1]*qguess > (num1[qdig]*10 + num1[qdig+1] - *n2ptr*qguess)*10 + num1[qdig+2]) {
                qguess--;
                /* And again. */
                if (n2.n_value[n2ptr+1]*qguess > (num1[qdig]*10 + num1[qdig+1] - n2.n_value[n2ptr]*qguess)*10 + num1[qdig+2]) { //if (n2ptr[1]*qguess > (num1[qdig]*10 + num1[qdig+1] - *n2ptr*qguess)*10 + num1[qdig+2])
                    qguess--;
                }
            }

            /* Multiply and subtract. */
            borrow = 0;
            if (qguess !== 0) {
                mval[0] = 0; //*mval = 0; // @CHECK is this to fix ptr2 < 0?
                libbcmath._one_mult(n2.n_value, n2ptr, len2, qguess, mval, 1); //_one_mult (n2ptr, len2, qguess, mval+1); // @CHECK

                ptr1 = qdig+len2; //(unsigned char *) num1+qdig+len2;
                ptr2 = len2; //(unsigned char *) mval+len2;

                // @CHECK: Does a negative pointer return null?
                //         ptr2 can be < 0 here as ptr1 = len2, thus count < len2+1 will always fail ?
                for (count = 0; count < len2+1; count++) {
                    if (ptr2 < 0) {
                        //val = libbcmath.cint(num1[ptr1]) - 0 - borrow;    //val = (int) *ptr1 - (int) *ptr2-- - borrow;
                        val = num1[ptr1] - 0 - borrow;    //val = (int) *ptr1 - (int) *ptr2-- - borrow;
                    } else {
                        //val = libbcmath.cint(num1[ptr1]) - libbcmath.cint(mval[ptr2--]) - borrow;    //val = (int) *ptr1 - (int) *ptr2-- - borrow;
                        val = num1[ptr1] - mval[ptr2--] - borrow;    //val = (int) *ptr1 - (int) *ptr2-- - borrow;
                    }
                    if (val < 0) {
                        val += 10;
                        borrow = 1;
                    } else {
                        borrow = 0;
                    }
                    num1[ptr1--] = val;
                }
            }

            /* Test for negative result. */
            if (borrow == 1) {
                qguess--;
                ptr1 = qdig+len2; //(unsigned char *) num1+qdig+len2;
                ptr2 = len2-1; //(unsigned char *) n2ptr+len2-1;
                carry = 0;
                for (count = 0; count < len2; count++) {
                    if (ptr2 < 0) {
                        //val = libbcmath.cint(num1[ptr1]) + 0 + carry; //val = (int) *ptr1 + (int) *ptr2-- + carry;
                        val = num1[ptr1] + 0 + carry; //val = (int) *ptr1 + (int) *ptr2-- + carry;
                    } else {
                        //val = libbcmath.cint(num1[ptr1]) + libbcmath.cint(n2.n_value[ptr2--]) + carry; //val = (int) *ptr1 + (int) *ptr2-- + carry;
                        val = num1[ptr1] + n2.n_value[ptr2--] + carry; //val = (int) *ptr1 + (int) *ptr2-- + carry;
                    }
                    if (val > 9) {
                        val -= 10;
                        carry = 1;
                    } else {
                        carry = 0;
                    }
                    num1[ptr1--] = val; //*ptr1-- = val;
                }
                if (carry == 1) {
                    //num1[ptr1] = libbcmath.cint((num1[ptr1] + 1) % 10);  // *ptr1 = (*ptr1 + 1) % 10; // @CHECK
                    num1[ptr1] = (num1[ptr1] + 1) % 10;  // *ptr1 = (*ptr1 + 1) % 10; // @CHECK
                }
            }

            /* We now know the quotient digit. */
            qval.n_value[qptr++] =  qguess;  //*qptr++ =  qguess;
            qdig++;
        }
    }

    /* Clean up and return the number. */
    qval.n_sign = ( n1.n_sign == n2.n_sign ? libbcmath.PLUS : libbcmath.MINUS );
    if (libbcmath.bc_is_zero(qval)) {
        qval.n_sign = libbcmath.PLUS;
    }
    libbcmath._bc_rm_leading_zeros(qval);

    return qval;

    //return 0;    /* Everything is OK. */
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = libbcmath
