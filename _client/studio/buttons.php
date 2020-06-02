<!DOCTYPE html>
        <div id="board" onkeydown="action(event)"
                        onkeyup="action(event)"
                        onmousedown="action(event)" 
                        onmouseup="action(event)">
                        <!-- TODO: Have the buttons be created on window load and give them event listeners-->
                        <button id="C2" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">C<br><br><span id="C2" style="color: #1CD5BC">↹</span></button>    
                        <button id="C#2" class="PianoKey sharp" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">C#<br><br><span id="C#2" style="color: #1CD5BC">1</span></button>
                        <button id="D2" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">D<br><br><span id="D2" style="color: #1CD5BC">Q</span></button>
                        <button id="D#2" class="PianoKey sharp" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">D#<br><br><span id="D#2" style="color: #1CD5BC">2</span></button>
                        <button id="E2" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">E<br><br><span id="E2" style="color: #1CD5BC">W</span></button>
                        <button id="F2" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">F<br><br><span id="F2" style="color: #1CD5BC">E</span></button>
                        <button id="F#2" class="PianoKey sharp" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">F#<br><br><span id="F#2" style="color: #1CD5BC">4</span></button>
                        <button id="G2" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">G<br><br><span id="G2" style="color: #1CD5BC">R</span></button>
                        <button id="G#2" class="PianoKey sharp" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">G#<br><br><span id="G#2" style="color: #1CD5BC">5</span></button>
                        <button id="A2" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">A<br><br><span id="A2" style="color: #1CD5BC">T</span></button>
                        <button id="A#2" class="PianoKey sharp" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">A#<br><br><span id="A#2" style="color: #1CD5BC">6</span></button>
                        <button id="B2" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">B<br><br><span id="B2" style="color: #1CD5BC">Y</span></button>
                        <button id="C3" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">C<br><br><span id="C3" style="color: #1CD5BC">U</span></button>
                        <button id="C#3" class="PianoKey sharp" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">C#<br><br><span id="C#3" style="color: #1CD5BC">8</span></button>
                        <button id="D3" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">D<br><br><span id="D3" style="color: #1CD5BC">I</span></button>
                        <button id="D#3" class="PianoKey sharp" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">D#<br><br><span id="D#3" style="color: #1CD5BC">9</span></button>
                        <button id="E3" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">E<br><br><span id="E3" style="color: #1CD5BC">O</span></button>
                        <button id="F3" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">F<br><br><span id="F3" style="color: #1CD5BC">P</span></button>
                        <button id="F#3" class="PianoKey sharp" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">F#<br><br><span id="F#3" style="color: #1CD5BC">-</span></button>
                        <button id="G3" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">G<br><br><span id="G3" style="color: #1CD5BC">[</span></button>
                        <button id="G#3" class="PianoKey sharp" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">G#<br><br><span id="G#3" style="color: #1CD5BC">=</span></button>
                        <button id="A3" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">A<br><br><span id="A3" style="color: #1CD5BC">]</span></button>
                        <button id="A#3" class="PianoKey sharp" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">A#<br><br><span id="A#3" style="color: #1CD5BC">←</span></button>
                        <button id="B3" class="PianoKey" onmouseout="sweepout(this.id)" onmouseover="sweep(this.id)">B<br><br><span id="B3" style="color: #1CD5BC">\</span></button>
                        <div id="lastKey" value="xx" val2="yy"></div>
        </div>